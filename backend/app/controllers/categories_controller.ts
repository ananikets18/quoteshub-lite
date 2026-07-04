import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { redis } from '#services/redis'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    const cacheKey = 'categories:all'
    const cached = await redis.get(cacheKey)
    if (cached) {
      return response.json(cached) // Upstash automatically parses JSON
    }

    const categories = await Category.query()
      .where('is_active', true)
      .orderBy('name', 'asc')

    await redis.set(cacheKey, categories, { ex: 60 * 60 * 24 })
    return response.json(categories)
  }
}