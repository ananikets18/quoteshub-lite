import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'
import PasswordReset from '#models/password_reset'
import stringHelpers from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import nodemailer from 'nodemailer'
import env from '#start/env'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/user'

// Setup nodemailer transporter once at startup (resolves TD9)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USERNAME || 'test',
    pass: process.env.SMTP_PASSWORD || 'test'
  }
})

export default class PasswordResetsController {
  async forgot({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    // Find user
    const user = await User.findBy('email', email)
    if (!user) {
      // Don't leak whether user exists, just return success
      return response.json({ message: 'If an account exists, a password reset link has been sent.' })
    }

    // Generate token
    const token = stringHelpers.generateRandom(32)

    // Save token to DB
    await PasswordReset.create({
      email: user.email,
      token,
      expiresAt: DateTime.now().plus({ hours: 1 })
    })



    const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:5173')
    const resetLink = `${frontendUrl}/reset-password?token=${token}`

    // Send email
    try {
      await transporter.sendMail({
        from: '"Quoteshub" <noreply@quoteshub.com>',
        to: user.email,
        subject: 'Reset Your Password',
        text: `Hello ${user.name},\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
        html: `<p>Hello ${user.name},</p><p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, please ignore this email.</p>`
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to send password reset email')
      // In a real app we might want to handle this, but for Lite we'll log it
    }

    return response.json({ message: 'If an account exists, a password reset link has been sent.' })
  }

  async reset({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    // Find the token
    const passwordReset = await PasswordReset.query()
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!passwordReset) {
      return response.status(400).json({ message: 'Invalid or expired password reset token.' })
    }

    // Find user
    const user = await User.findBy('email', passwordReset.email)
    if (!user) {
      return response.status(400).json({ message: 'User not found.' })
    }

    // Update password (model hook will hash it)
    user.password = password
    await user.save()

    // Delete all tokens for this user
    await PasswordReset.query().where('email', user.email).delete()

    return response.json({ message: 'Password has been successfully reset.' })
  }
}
