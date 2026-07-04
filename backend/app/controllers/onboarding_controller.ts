import type { HttpContext } from '@adonisjs/core/http'
import { onboardingValidator } from '#validators/user'

export default class OnboardingController {
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    
    const payload = await request.validateUsing(onboardingValidator)
    const { username, bio } = payload

    user.isOnboarded = true
    if (username) user.username = username
    if (bio) user.bio = bio

    await user.save()

    return response.ok({ message: 'Onboarding complete', user })
  }
}
