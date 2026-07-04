import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { redis } from '#services/redis'

export default class HealthController {
  async handle({ response }: HttpContext) {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown'
      }
    }

    let isHealthy = true

    // Check Database
    try {
      await db.rawQuery('SELECT 1')
      health.services.database = 'ok'
    } catch (error) {
      health.services.database = 'unreachable'
      isHealthy = false
    }

    // Check Redis
    try {
      const ping = await redis.ping()
      if (ping === 'PONG') {
        health.services.redis = 'ok'
      } else {
        health.services.redis = 'unreachable'
        isHealthy = false
      }
    } catch (error) {
      health.services.redis = 'unreachable'
      isHealthy = false
    }

    if (!isHealthy) {
      health.status = 'error'
      return response.serviceUnavailable(health)
    }

    return response.ok(health)
  }
}
