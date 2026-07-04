import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'
import { DateTime } from 'luxon'

export default class NotificationsController {
  async index({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(notifications)
  }

  async markAsRead({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    await Notification.query()
      .where('user_id', user.id)
      .whereNull('read_at')
      .update({ read_at: DateTime.now().toJSDate() })

    return response.ok({ message: 'Notifications marked as read' })
  }
}
