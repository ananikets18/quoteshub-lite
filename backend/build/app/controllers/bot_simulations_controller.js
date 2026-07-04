import { faker } from '@faker-js/faker';
import User from '#models/user';
import Quote from '#models/quote';
import Like from '#models/like';
import Save from '#models/save';
export default class BotSimulationsController {
    async handle({ request, response }) {
        const secret = request.header('x-simulator-secret');
        if (!secret) {
            return response.unauthorized({ error: 'Missing secret token' });
        }
        try {
            const numUsers = faker.number.int({ min: 1, max: 3 });
            const newUsers = [];
            for (let i = 0; i < numUsers; i++) {
                const user = await User.create({
                    name: faker.person.fullName(),
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    avatar: faker.image.avatar(),
                    role: 'user',
                    isBot: true,
                });
                newUsers.push(user);
            }
            const newQuotes = [];
            for (const user of newUsers) {
                const numQuotes = faker.number.int({ min: 1, max: 2 });
                for (let j = 0; j < numQuotes; j++) {
                    const quote = await Quote.create({
                        userId: user.id,
                        content: faker.lorem.paragraph(),
                        author: faker.person.fullName(),
                        source: faker.company.name(),
                    });
                    newQuotes.push(quote);
                }
            }
            const allBots = await User.query().where('is_bot', true).limit(50);
            const recentQuotes = await Quote.query().orderBy('created_at', 'desc').limit(20);
            let likesAdded = 0;
            let savesAdded = 0;
            if (allBots.length > 0 && recentQuotes.length > 0) {
                const numInteractions = faker.number.int({ min: 5, max: 15 });
                for (let k = 0; k < numInteractions; k++) {
                    const randomBot = faker.helpers.arrayElement(allBots);
                    const randomQuote = faker.helpers.arrayElement(recentQuotes);
                    if (faker.number.int({ min: 1, max: 100 }) <= 70) {
                        const existingLike = await Like.query()
                            .where('user_id', randomBot.id)
                            .where('quote_id', randomQuote.id)
                            .first();
                        if (!existingLike) {
                            await Like.create({ userId: randomBot.id, quoteId: randomQuote.id });
                            likesAdded++;
                        }
                    }
                    else {
                        const existingSave = await Save.query()
                            .where('user_id', randomBot.id)
                            .where('quote_id', randomQuote.id)
                            .first();
                        if (!existingSave) {
                            await Save.create({ userId: randomBot.id, quoteId: randomQuote.id, collection: 'default' });
                            savesAdded++;
                        }
                    }
                }
            }
            return response.json({
                message: 'Bot simulation completed successfully',
                stats: {
                    newUsersCreated: newUsers.length,
                    newQuotesCreated: newQuotes.length,
                    newLikesAdded: likesAdded,
                    newSavesAdded: savesAdded,
                }
            });
        }
        catch (error) {
            console.error(error);
            return response.internalServerError({ error: 'Failed to run simulation', details: error.message });
        }
    }
}
//# sourceMappingURL=bot_simulations_controller.js.map