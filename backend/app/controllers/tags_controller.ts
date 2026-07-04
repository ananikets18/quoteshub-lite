import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { redis } from '#services/redis'

export default class TagsController {
  async index({ response }: HttpContext) {
    const cacheKey = 'tags:all'
    const cached = await redis.get(cacheKey)
    if (cached) {
      return response.json(cached)
    }

    const tags = await Tag.query().orderBy('name', 'asc')
    await redis.set(cacheKey, tags, { ex: 60 * 60 * 24 })
    return response.json(tags)
  }
}