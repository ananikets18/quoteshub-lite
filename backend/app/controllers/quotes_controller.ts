import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createQuoteValidator, updateQuoteValidator } from '#validators/quote'
import QuoteService from '#services/quote_service'
import Quote from '#models/quote'
import QuotePolicy from '#policies/quote_policy'

@inject()
export default class QuotesController {
  constructor(private quoteService: QuoteService) {}

  async index({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')
    const category = request.input('category')
    const tag = request.input('tag')

    let currentUser = null
    try {
      if (await auth.check()) currentUser = auth.user!
    } catch {}

    const result = await this.quoteService.getQuotes({ page, limit, search, category, tag }, currentUser)
    return response.json(result)
  }

  async show({ params, response, auth }: HttpContext) {
    let currentUser = null
    try {
      if (await auth.check()) currentUser = auth.user!
    } catch {}

    const result = await this.quoteService.getQuoteById(params.id, currentUser)
    return response.json(result)
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createQuoteValidator)
    const user = auth.getUserOrFail()

    const quote = await this.quoteService.createQuote(payload, user.id)
    return response.created(quote)
  }

  async update({ params, request, response, auth, bouncer }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateQuoteValidator)

    const quote = await Quote.findOrFail(params.id)
    
    // Policy check
    if (await bouncer.with(QuotePolicy).denies('update', quote)) {
      return response.forbidden({ error: 'You can only update your own quotes.' })
    }

    const updatedQuote = await this.quoteService.updateQuote(quote, payload)
    return response.ok(updatedQuote)
  }

  async destroy({ params, response, auth, bouncer }: HttpContext) {
    const user = auth.getUserOrFail()

    const quote = await Quote.findOrFail(params.id)
    
    // Policy check
    if (await bouncer.with(QuotePolicy).denies('delete', quote)) {
      return response.forbidden({ error: 'You can only delete your own quotes.' })
    }

    await this.quoteService.deleteQuote(quote)
    return response.ok({ message: 'Quote deleted successfully.' })
  }

  async toggleLike({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const result = await this.quoteService.toggleLike(params.id, { id: user.id, name: user.name })
    return response.ok(result)
  }

  async toggleSave({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const result = await this.quoteService.toggleSave(params.id, { id: user.id, name: user.name })
    return response.ok(result)
  }
}