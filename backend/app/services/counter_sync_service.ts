import Quote from '#models/quote'
import { redis } from '#services/redis'

export default class CounterSyncService {
  /**
   * Reads all batched counters from Redis, resets them,
   * and commits the aggregated totals to PostgreSQL.
   */
  async syncCounters() {
    try {
      // 1. Sync Views
      const views = await redis.hgetall('quotes:views')
      if (views && Object.keys(views).length > 0) {
        // Clear immediately to start fresh batch
        await redis.del('quotes:views')
        
        for (const [id, countStr] of Object.entries(views)) {
          const count = parseInt(countStr as string, 10)
          if (count > 0) {
            await Quote.query().where('id', id).increment('viewsCount', count).catch(console.error)
          }
        }
      }

      // 2. Sync Impressions
      const impressions = await redis.hgetall('quotes:impressions')
      if (impressions && Object.keys(impressions).length > 0) {
        await redis.del('quotes:impressions')
        
        for (const [id, countStr] of Object.entries(impressions)) {
          const count = parseInt(countStr as string, 10)
          if (count > 0) {
            await Quote.query().where('id', id).increment('impressionsCount', count).catch(console.error)
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync counters from Redis to Postgres:', error)
    }
  }
}
