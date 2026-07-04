import Quote from '#models/quote';
export default class QuotesController {
    async index({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 20);
        const quotes = await Quote.query()
            .preload('user')
            .withCount('likes')
            .withCount('saves')
            .orderBy('created_at', 'desc')
            .paginate(page, limit);
        return response.json(quotes);
    }
    async store({ request, response }) {
        const { content, author, source } = request.only(['content', 'author', 'source']);
        const { default: User } = await import('#models/user');
        let defaultUser = await User.first();
        if (!defaultUser) {
            defaultUser = await User.create({
                name: 'Anonymous',
                username: 'anonymous',
                email: 'anon@quoteshub.local',
                password: 'password',
                role: 'user'
            });
        }
        const quote = await Quote.create({
            content,
            author: author || 'Unknown',
            source,
            userId: defaultUser.id,
        });
        return response.created(quote);
    }
}
//# sourceMappingURL=quotes_controller.js.map