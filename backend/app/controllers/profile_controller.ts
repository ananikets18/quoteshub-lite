import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import Quote from '#models/quote'

export default class ProfileController {
  async show({ auth }: HttpContext) {
    return UserTransformer.transform(auth.getUserOrFail())
  }

  async update({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { updateProfileValidator } = await import('#validators/profile')
    const payload = await request.validateUsing(updateProfileValidator)

    user.name = payload.name
    if (payload.bio !== undefined) {
      user.bio = payload.bio
    }
    await user.save()

    return response.ok(UserTransformer.transform(user))
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.delete()
    return response.ok({ message: 'Account deleted successfully' })
  }

  async saved({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const quotes = await Quote.query()
      .whereHas('saves', (q) => {
        q.where('user_id', user.id)
      })
      .preload('user')
      .preload('categories')
      .preload('tags')
      .withCount('likes')
      .withCount('saves')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(quotes)
  }

  async liked({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const quotes = await Quote.query()
      .whereHas('likes', (q) => {
        q.where('user_id', user.id)
      })
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
