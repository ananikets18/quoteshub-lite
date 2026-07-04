import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

@inject()
export default class NewAccountController {
  constructor(private authService: AuthService) {}

  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const { user } = await this.authService.register(payload)
    
    await auth.use('web').login(user)

    return {
      user: UserTransformer.transform(user),
    }
  }
}
