import { Redis } from '@upstash/redis'
import env from '#start/env'

export const redis = new Redis({
  url: env.get('UPSTASH_REDIS_REST_URL'),
  token: env.get('UPSTASH_REDIS_REST_TOKEN')
})
