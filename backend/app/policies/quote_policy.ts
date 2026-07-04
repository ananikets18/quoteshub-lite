import User from '#models/user'
import Quote from '#models/quote'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

import { UserRole } from '#enums/user_role'

export default class QuotePolicy extends BasePolicy {
  // Admin bypass
  async before(user: User | null) {
    if (user && user.role === UserRole.ADMIN) {
      return true
    }
  }

  update(user: User, quote: Quote): AuthorizerResponse {
    return user.id === quote.userId
  }

  delete(user: User, quote: Quote): AuthorizerResponse {
    return user.id === quote.userId
  }
}