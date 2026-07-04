import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/health', [() => import('#controllers/health_controller'), 'handle'])

// Bot simulation moved inside /api/v1

router
  .group(() => {
    // Quote Routes
    router.get('quotes', [() => import('#controllers/quotes_controller'), 'index'])
    router.get('quotes/:id', [() => import('#controllers/quotes_controller'), 'show'])
    router.post('quotes', [() => import('#controllers/quotes_controller'), 'store']).use(middleware.auth())
    router.put('quotes/:id', [() => import('#controllers/quotes_controller'), 'update']).use(middleware.auth())
    router.delete('quotes/:id', [() => import('#controllers/quotes_controller'), 'destroy']).use(middleware.auth())
    router.put('quotes/:id/like', [() => import('#controllers/quotes_controller'), 'toggleLike']).use(middleware.auth())
    router.put('quotes/:id/save', [() => import('#controllers/quotes_controller'), 'toggleSave']).use(middleware.auth())

    // Public Data Routes
    router.get('categories', [() => import('#controllers/categories_controller'), 'index'])
    router.get('tags', [() => import('#controllers/tags_controller'), 'index'])

    // User Public Routes
    router.get('users/:username', [() => import('#controllers/users_controller'), 'show'])
    router.get('users/:username/quotes', [() => import('#controllers/users_controller'), 'quotes'])

    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
        router.post('forgot-password', [() => import('#controllers/password_resets_controller'), 'forgot'])
        router.post('reset-password', [() => import('#controllers/password_resets_controller'), 'reset'])
      })
      .prefix('auth')
      .use(middleware.rateLimit({ limiter: 'auth' }))

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show']).as('show')
        router.put('profile', [controllers.Profile, 'update']).as('update')
        router.delete('profile', [controllers.Profile, 'destroy']).as('destroy')
        router.get('analytics', [() => import('#controllers/analytics_controller'), 'index']).as('analytics')
        router.get('saved', [controllers.Profile, 'saved']).as('saved')
        router.get('liked', [controllers.Profile, 'liked']).as('liked')
        router.post('onboard', [() => import('#controllers/onboarding_controller'), 'store']).as('onboard')
        router.post('logout', [controllers.AccessTokens, 'destroy']).as('logout')
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [() => import('#controllers/notifications_controller'), 'index'])
        router.patch('read', [() => import('#controllers/notifications_controller'), 'markAsRead'])
      })
      .prefix('notifications')
      .use(middleware.auth())

    // Admin Routes
    router
      .group(() => {
        router.get('users', [() => import('#controllers/admin_controller'), 'users'])
        router.delete('users/:id', [() => import('#controllers/admin_controller'), 'deleteUser'])
        router.delete('quotes/:id', [() => import('#controllers/admin_controller'), 'deleteQuote'])
      })
      .prefix('admin')
      .use([middleware.auth(), middleware.admin()])
      
    // Bot simulation
    router.post('/internal/simulate', [() => import('#controllers/bot_simulations_controller'), 'handle'])
  })
  .prefix('/api/v1')
  .use(middleware.rateLimit())

