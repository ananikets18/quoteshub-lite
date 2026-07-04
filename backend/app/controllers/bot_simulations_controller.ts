import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { faker } from '@faker-js/faker'
import env from '#start/env'
import User from '#models/user'
import { UserRole } from '#enums/user_role'
import Quote from '#models/quote'
import Like from '#models/like'
import Save from '#models/save'

export default class BotSimulationsController {
  async handle({ request, response }: HttpContext) {
    const secret = request.header('x-simulator-secret')
    const expectedSecret = env.get('SIMULATOR_SECRET')

    if (!secret) {
      return response.unauthorized({ error: 'Missing secret token' })
    }

    if (!expectedSecret || secret !== expectedSecret) {
      return response.unauthorized({ error: 'Invalid secret token' })
    }

    try {
      // 1. Create 1-3 fake users
      const numUsers = faker.number.int({ min: 1, max: 3 })
      const newUsers = []
      
      for (let i = 0; i < numUsers; i++) {
        const user = await User.create({
          name: faker.person.fullName(),
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          avatar: faker.image.avatar(),
          role: UserRole.USER,
          isBot: true,
        })
        newUsers.push(user)
      }

      // 2. Generate 1-2 quotes for these users
      const newQuotes = []
      for (const user of newUsers) {
        const numQuotes = faker.number.int({ min: 1, max: 2 })
        for (let j = 0; j < numQuotes; j++) {
          const quote = await Quote.create({
            userId: user.id,
            content: faker.lorem.paragraph(),
            author: faker.person.fullName(), // Fake author
            source: faker.company.name(),
          })
          newQuotes.push(quote)
        }
      }

      // 3. Simulate Engagement: Random bots like/save random quotes
      // Get all bot users
      const allBots = await User.query().where('is_bot', true).limit(50)
      
      // Get recent quotes
      const recentQuotes = await Quote.query().orderBy('created_at', 'desc').limit(20)

      let likesAdded = 0
      let savesAdded = 0

      if (allBots.length > 0 && recentQuotes.length > 0) {
        const numInteractions = faker.number.int({ min: 5, max: 15 })
        
        for (let k = 0; k < numInteractions; k++) {
          const randomBot = faker.helpers.arrayElement(allBots)
          const randomQuote = faker.helpers.arrayElement(recentQuotes)
          
          // Randomly choose to like (70% chance) or save (30% chance)
          if (faker.number.int({ min: 1, max: 100 }) <= 70) {
            // Check if like exists
            const existingLike = await Like.query()
              .where('user_id', randomBot.id)
              .where('quote_id', randomQuote.id)
              .first()
              
            if (!existingLike) {
              await Like.create({ userId: randomBot.id, quoteId: randomQuote.id })
              likesAdded++
            }
          } else {
            // Check if save exists
            const existingSave = await Save.query()
              .where('user_id', randomBot.id)
              .where('quote_id', randomQuote.id)
              .first()
              
            if (!existingSave) {
              await Save.create({ userId: randomBot.id, quoteId: randomQuote.id, collection: 'default' })
              savesAdded++
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
      })

    } catch (error) {
      logger.error(error)
      return response.internalServerError({ error: 'Failed to run simulation', details: (error as Error).message })
    }
  }
}