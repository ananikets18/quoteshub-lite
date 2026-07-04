import Quote from '#models/quote'
import Like from '#models/like'
import Save from '#models/save'
import Notification from '#models/notification'
import { redis } from '#services/redis'

export default class QuoteService {
  async getQuotes(options: { page: number; limit: number; search?: string; category?: string; tag?: string }, currentUser?: { id: number } | null) {
    const { page, limit, search, category, tag } = options
    
    // 1. Check Cache for default feed (Page 1, No Filters)
    const isDefaultFeed = page === 1 && !search && !category && !tag
    const cacheKey = 'quotes:feed:default'
    let rawQuotes: any = null
    let meta: any = null

    if (isDefaultFeed) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        const parsed = cached as any
        rawQuotes = parsed.data
        meta = parsed.meta
      }
    }

    // 2. Query DB if not cached
    if (!rawQuotes) {
      const query = Quote.query()
        .preload('user')
        .preload('categories')
        .preload('tags')
        .withCount('likes')
        .withCount('saves')
        .orderBy('created_at', 'desc')

      if (search) {
        query.where((q) => {
          q.whereILike('content', `%${search}%`)
           .orWhereILike('author', `%${search}%`)
        })
      }

      if (category) {
        query.whereHas('categories', (q) => {
          q.where('slug', category)
        })
      }

      if (tag) {
        query.whereHas('tags', (q) => {
          q.where('slug', tag)
        })
      }

      const paginatedQuotes = await query.paginate(page, limit)
      meta = paginatedQuotes.getMeta()
      rawQuotes = paginatedQuotes.all().map((q) => {
        const json = q.toJSON()
        json.$extras = {
          likes_count: Number((q as any).$extras.likes_count) || 0,
          saves_count: Number((q as any).$extras.saves_count) || 0,
        }
        return json
      })

      if (isDefaultFeed) {
        await redis.set(cacheKey, { meta, data: rawQuotes }, { ex: 300 }) // Cache for 5 minutes
      }
    }

    // 3. Increment impressions asynchronously via Redis
    const quoteIds = rawQuotes.map((q: any) => q.id)
    if (quoteIds.length > 0) {
      Promise.all(
        quoteIds.map((id: number) => redis.hincrby('quotes:impressions', id.toString(), 1))
      ).catch(console.error)
    }

    // 4. If logged in, enrich each quote with the user's like/save state
    if (currentUser) {
      const userId = currentUser.id

      const [likedIds, savedIds] = await Promise.all([
        Like.query()
          .whereIn('quote_id', quoteIds)
          .where('user_id', userId)
          .select('quote_id'),
        Save.query()
          .whereIn('quote_id', quoteIds)
          .where('user_id', userId)
          .select('quote_id'),
      ])

      const likedSet = new Set(likedIds.map((l) => l.quoteId))
      const savedSet = new Set(savedIds.map((s) => s.quoteId))

      rawQuotes = rawQuotes.map((quote: any) => ({
        ...quote,
        $extras: {
          ...quote.$extras,
          is_liked: likedSet.has(quote.id),
          is_saved: savedSet.has(quote.id)
        }
      }))
    } else {
      // Default to false for anonymous
      rawQuotes = rawQuotes.map((quote: any) => ({
        ...quote,
        $extras: {
          ...quote.$extras,
          is_liked: false,
          is_saved: false
        }
      }))
    }

    return {
      meta,
      data: rawQuotes
    }
  }

  async getQuoteById(id: number, currentUser?: { id: number } | null) {
    const quote = await Quote.query()
      .where('id', id)
      .preload('user')
      .preload('categories')
      .preload('tags')
      .withCount('likes')
      .withCount('saves')
      .firstOrFail()

    // Increment views asynchronously via Redis
    redis.hincrby('quotes:views', quote.id.toString(), 1).catch(console.error)

    let is_liked = false
    let is_saved = false

    if (currentUser) {
      const userId = currentUser.id
      const [liked, saved] = await Promise.all([
        Like.query().where('quote_id', quote.id).where('user_id', userId).first(),
        Save.query().where('quote_id', quote.id).where('user_id', userId).first(),
      ])
      is_liked = !!liked
      is_saved = !!saved
    }

    const json = quote.toJSON()
    json.$extras = {
      likes_count: Number((quote as any).$extras.likes_count) || 0,
      saves_count: Number((quote as any).$extras.saves_count) || 0,
      is_liked,
      is_saved,
    }

    return json
  }

  async createQuote(payload: any, userId: number) {
    const quote = await Quote.create({
      content: payload.content,
      author: payload.author || 'Unknown',
      source: payload.source,
      userId,
    })

    if (payload.categoryIds && payload.categoryIds.length > 0) {
      await quote.related('categories').attach(payload.categoryIds)
    }
    if (payload.tagIds && payload.tagIds.length > 0) {
      await quote.related('tags').attach(payload.tagIds)
    }

    await quote.load('categories')
    await quote.load('tags')

    return quote
  }

  async updateQuote(quote: Quote, payload: any) {

    if (payload.content) quote.content = payload.content
    if (payload.author) quote.author = payload.author
    if (payload.source !== undefined) quote.source = payload.source

    await quote.save()

    if (payload.categoryIds !== undefined) {
      await quote.related('categories').sync(payload.categoryIds)
    }
    if (payload.tagIds !== undefined) {
      await quote.related('tags').sync(payload.tagIds)
    }

    await quote.load('categories')
    await quote.load('tags')

    return quote
  }

  async deleteQuote(quote: Quote) {
    await quote.delete()
  }

  async toggleLike(id: number, user: { id: number; name: string }) {
    const quote = await Quote.findOrFail(id)

    const existing = await Like.query()
      .where('user_id', user.id)
      .where('quote_id', quote.id)
      .first()

    let liked: boolean

    if (existing) {
      await existing.delete()
      liked = false
    } else {
      await Like.create({ userId: user.id, quoteId: quote.id })
      liked = true

      if (quote.userId !== user.id) {
        await Notification.create({
          userId: quote.userId,
          type: 'like',
          data: { quoteId: quote.id, fromUserId: user.id, fromUserName: user.name }
        })
      }
    }

    const count = await Like.query().where('quote_id', quote.id).count('* as total')
    const total = Number((count[0] as any).$extras.total)

    return { liked, count: total }
  }

  async toggleSave(id: number, user: { id: number; name: string }) {
    const quote = await Quote.findOrFail(id)

    const existing = await Save.query()
      .where('user_id', user.id)
      .where('quote_id', quote.id)
      .first()

    let saved: boolean

    if (existing) {
      await existing.delete()
      saved = false
    } else {
      await Save.create({ userId: user.id, quoteId: quote.id, collection: 'default' })
      saved = true

      if (quote.userId !== user.id) {
        await Notification.create({
          userId: quote.userId,
          type: 'save',
          data: { quoteId: quote.id, fromUserId: user.id, fromUserName: user.name }
        })
      }
    }

    const count = await Save.query().where('quote_id', quote.id).count('* as total')
    const total = Number((count[0] as any).$extras.total)

    return { saved, count: total }
  }
}
