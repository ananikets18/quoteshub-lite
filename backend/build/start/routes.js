import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
import { controllers } from '#generated/controllers';
router.get('/', () => {
    return { hello: 'world' };
});
router.post('/api/internal/simulate', [() => import('#controllers/bot_simulations_controller'), 'handle']);
router
    .group(() => {
    router.get('quotes', [() => import('#controllers/quotes_controller'), 'index']);
    router.post('quotes', [() => import('#controllers/quotes_controller'), 'store']);
    router.get('categories', [() => import('#controllers/categories_controller'), 'index']);
    router.get('tags', [() => import('#controllers/tags_controller'), 'index']);
    router
        .group(() => {
        router.post('signup', [controllers.NewAccount, 'store']);
        router.post('login', [controllers.AccessTokens, 'store']);
    })
        .prefix('auth')
        .as('auth');
    router
        .group(() => {
        router.get('profile', [controllers.Profile, 'show']);
        router.post('logout', [controllers.AccessTokens, 'destroy']);
    })
        .prefix('account')
        .as('profile')
        .use(middleware.auth());
})
    .prefix('/api/v1');
//# sourceMappingURL=routes.js.map