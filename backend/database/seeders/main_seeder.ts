import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Quote from '#models/quote'
import Category from '#models/category'
import Tag from '#models/tag'
import { faker } from '@faker-js/faker'
import { UserRole } from '#enums/user_role'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // 1. Create some random categories
    const categories = ['Inspirational', 'Life', 'Success', 'Wisdom', 'Love', 'Technology']
    const createdCategories = await Promise.all(
      categories.map((name) => Category.firstOrCreate({ slug: name.toLowerCase() }, { name, slug: name.toLowerCase(), color: faker.color.rgb() }))
    )

    // 2. Create some random tags
    const tags = ['mindset', 'growth', 'future', 'happiness', 'motivation', 'peace']
    const createdTags = await Promise.all(
      tags.map((name) => Tag.firstOrCreate({ slug: name.toLowerCase() }, { name, slug: name.toLowerCase() }))
    )

    // 3. Create 12 Dummy Users
    const usersData = Array.from({ length: 12 }).map(() => ({
      name: faker.person.fullName(),
      username: faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
      email: faker.internet.email(),
      password: 'Password123!', // Standard password for testing
      role: UserRole.USER,
      isBot: false,
      isOnboarded: true,
      bio: faker.person.bio().slice(0, 100),
    }))

    const users = await User.createMany(usersData)

    // 4. Create 50 Quotes distributed among the users
    const quotesData = Array.from({ length: 50 }).map(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      return {
        userId: randomUser.id,
        content: faker.lorem.paragraph(2).slice(0, 250),
        author: faker.person.fullName(),
        source: 'Seeded Data',
      }
    })

    const quotes = await Quote.createMany(quotesData)

    // 5. Attach random categories and tags to quotes
    for (const quote of quotes) {
      const numCategories = faker.number.int({ min: 1, max: 2 })
      const quoteCategories = faker.helpers.arrayElements(createdCategories, numCategories).map(c => c.id)
      
      const numTags = faker.number.int({ min: 1, max: 3 })
      const quoteTags = faker.helpers.arrayElements(createdTags, numTags).map(t => t.id)

      await quote.related('categories').sync(quoteCategories)
      await quote.related('tags').sync(quoteTags)
    }

    console.log('✅ Successfully seeded 12 Users, 6 Categories, 6 Tags, and 50 Quotes!')
  }
}