import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Quote from '#models/quote'

export default class AdminController {
  /**
   * Get all users for the admin dashboard
   */
  async users({ response }: HttpContext) {
    const users = await User.query().withCount('quotes').orderBy('createdAt', 'desc')
    
    // Map to include quote counts to avoid sending massive payloads
    const mappedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.name,
      username: user.username,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
      totalQuotes: Number(user.$extras.quotes_count) || 0
    }))
    
    return response.json(mappedUsers)
  }

  /**
   * Delete any user and all their associated data (quotes cascade ideally, or manual)
   */
  async deleteUser({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    
    // Prevent admin self-deletion
    if (user.role === 'admin') {
      return response.status(400).json({
        errors: [{ message: 'Cannot delete an admin account.' }]
      })
    }
    
    await user.delete()
    
    return response.json({ message: 'User deleted successfully.' })
  }

  /**
   * Delete any quote on the platform
   */
  async deleteQuote({ params, response }: HttpContext) {
    const quote = await Quote.findOrFail(params.id)
    await quote.delete()
    
    return response.json({ message: 'Quote deleted successfully.' })
  }
}
