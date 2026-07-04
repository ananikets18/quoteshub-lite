import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import env from '#start/env'

// Initialize Upstash Redis client
const redis = new Redis({
  url: env.get('UPSTASH_REDIS_REST_URL'),
  token: env.get('UPSTASH_REDIS_REST_TOKEN')
})

// Global limiter: 60 requests per 1 minute
export const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/global'
})

// Auth limiter: 5 requests per 5 minutes
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '5 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth'
})
