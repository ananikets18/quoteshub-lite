import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

@inject()
export default class AccessTokensController {
  constructor(private authService: AuthService) {}

  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const { user } = await this.authService.login(payload)
    
    await auth.use('web').login(user)

    return {
      user: UserTransformer.transform(user)
    }
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('web').logout()

    return {
      message: 'Logged out successfully',
    }
  }
}
