import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string(),
  username: vine.string().minLength(3).maxLength(30).alphaNumeric().unique({ table: 'users', column: 'username' }),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const onboardingValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(30).alphaNumeric().unique({ table: 'users', column: 'username' }).optional(),
    bio: vine.string().maxLength(200).optional()
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: email()
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: password()
  })
)
