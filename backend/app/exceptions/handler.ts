import app from '@adonisjs/core/services/app'
import { errors as authErrors } from '@adonisjs/auth'
import { errors as bouncerErrors } from '@adonisjs/bouncer'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(401).send({
        errors: [{ message: 'Unauthorized. Please log in.' }]
      })
    }

    if (error instanceof bouncerErrors.E_AUTHORIZATION_FAILURE) {
      return ctx.response.status(403).send({
        errors: [{ message: 'Forbidden. You do not have permission.' }]
      })
    }

    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        errors: [{ message: 'Resource not found.' }]
      })
    }
    
    // Format validation errors cleanly
    if ((error as any).code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(422).send({
        errors: (error as any).messages
      })
    }

    // Default to JSON instead of HTML in API mode
    if (ctx.request.accepts(['json'])) {
      const status = (error as any).status || 500
      const message = this.debug ? (error as any).message : 'Internal Server Error'
      return ctx.response.status(status).send({
        errors: [{ message }]
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
