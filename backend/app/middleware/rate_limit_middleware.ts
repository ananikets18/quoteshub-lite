import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { globalLimiter, authLimiter } from '#services/rate_limiter'
import env from '#start/env'

export default class RateLimitMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      limiter?: 'global' | 'auth'
    } = {}
  ) {
    if (env.get('NODE_ENV') === 'development') {
      return next()
    }

    const { request, response } = ctx
    const ip = request.ip()
    
    // Choose the appropriate limiter based on options, default to global
    const limiter = options.limiter === 'auth' ? authLimiter : globalLimiter
    
    // Check limit
    try {
      const { success, limit, remaining, reset } = await limiter.limit(ip)
      
      // Set headers
      response.header('X-RateLimit-Limit', limit.toString())
      response.header('X-RateLimit-Remaining', remaining.toString())
      response.header('X-RateLimit-Reset', reset.toString())
      
      if (!success) {
        return response.status(429).json({
          errors: [{ message: 'Too many requests, please try again later.' }]
        })
      }
    } catch (error: any) {
      // If Upstash Redis is unreachable (e.g. paused/deleted), we fail open
      // to ensure the app continues to work in development or during outages.
      console.error('Rate limiter bypassed due to error:', error?.message || String(error))
    }
    
    return next()
  }
}
