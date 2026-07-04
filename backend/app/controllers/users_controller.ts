import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Quote from '#models/quote'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  async show({ params, response }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)

    // Get total quotes for this user
    const stats = await db.from('quotes')
      .where('user_id', user.id)
      .count('* as totalQuotes')
      .first()

    return response.json({
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      createdAt: user.createdAt,
      totalQuotes: Number(stats?.totalQuotes || 0),
    })
  }

  async quotes({ params, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    // Ensure user exists
    const user = await User.findByOrFail('username', params.username)

    const quotes = await Quote.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('categories')
      .preload('tags')
      .withCount('likes')
      .withCount('saves')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(quotes)
  }
}
