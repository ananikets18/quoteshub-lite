import type { ApplicationService } from '@adonisjs/core/types'
import CounterSyncService from '#services/counter_sync_service'

export default class SchedulerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    // Only run the scheduler if we are in the main web process
    if (this.app.getEnvironment() === 'web') {
      const syncService = new CounterSyncService()
      
      // Run the sync every 60 seconds
      setInterval(() => {
        syncService.syncCounters().catch(console.error)
      }, 60 * 1000)
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    // We could clear the interval here, but process exit will handle it.
  }
}
