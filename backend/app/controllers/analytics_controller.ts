import type { HttpContext } from '@adonisjs/core/http'
import Quote from '#models/quote'
import Like from '#models/like'
import Save from '#models/save'

export default class AnalyticsController {
  async index({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    // Aggregate stats for views, impressions, and quotes count
    const stats = await Quote.query()
      .where('userId', user.id)
      .sum('viewsCount', 'totalViews')
      .sum('impressionsCount', 'totalImpressions')
      .count('*', 'totalQuotes')
      .first()

    const totalQuotes = Number(stats?.$extras?.totalQuotes || 0)
    const totalViews = Number(stats?.$extras?.totalViews || 0)
    const totalImpressions = Number(stats?.$extras?.totalImpressions || 0)

    // Aggregate likes
    const likesStats = await Like.query()
      .join('quotes', 'likes.quote_id', 'quotes.id')
      .where('quotes.user_id', user.id)
      .count('*', 'totalLikes')
      .first()
    const totalLikes = Number(likesStats?.$extras?.totalLikes || 0)

    // Aggregate saves
    const savesStats = await Save.query()
      .join('quotes', 'saves.quote_id', 'quotes.id')
      .where('quotes.user_id', user.id)
      .count('*', 'totalSaves')
      .first()
    const totalSaves = Number(savesStats?.$extras?.totalSaves || 0)

    // Fetch top performing quote
    const topQuote = await Quote.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('categories')
      .preload('tags')
      .withCount('likes')
      .withCount('saves')
      .orderByRaw('( (SELECT count(*) FROM likes WHERE likes.quote_id = quotes.id) + views_count ) DESC')
      .first()

    if (topQuote) {
      const json = topQuote.toJSON()
      json.$extras = {
        likes_count: Number((topQuote as any).$extras.likes_count) || 0,
        saves_count: Number((topQuote as any).$extras.saves_count) || 0,
      }
      return response.json({
        totalQuotes,
        totalLikes,
        totalSaves,
        totalViews,
        totalImpressions,
        engagementRate: totalImpressions > 0 ? ((totalLikes + totalSaves) / totalImpressions) : 0,
        topQuote: json
      })
    }

    return response.json({
      totalQuotes,
      totalLikes,
      totalSaves,
      totalViews,
      totalImpressions,
      engagementRate: totalImpressions > 0 ? ((totalLikes + totalSaves) / totalImpressions) : 0,
      topQuote: null
    })
  }
}