import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { UserRole } from '#enums/user_role'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    
    if (!user || user.role !== UserRole.ADMIN) {
      return ctx.response.status(403).json({
        errors: [{ message: 'Forbidden. Admin access required.' }]
      })
    }
    
    return next()
  }
}
