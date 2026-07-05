import { faker } from '@faker-js/faker'
import fs from 'fs'

const categories = [
  { id: 1000, name: 'Inspirational Quotes', slug: 'inspirational-quotes', color: '#ff5733' },
  { id: 1001, name: 'Life Lessons', slug: 'life-lessons', color: '#33ff57' },
  { id: 1002, name: 'Success Mindset', slug: 'success-mindset', color: '#3357ff' },
  { id: 1003, name: 'Wisdom Words', slug: 'wisdom-words', color: '#ff33a8' },
  { id: 1004, name: 'Love & Relationships', slug: 'love-relationships', color: '#a833ff' },
  { id: 1005, name: 'Future Tech', slug: 'future-tech', color: '#33d4ff' },
]

const tags = [
  { id: 1000, name: 'mindset-growth', slug: 'mindset-growth' },
  { id: 1001, name: 'personal-growth', slug: 'personal-growth' },
  { id: 1002, name: 'the-future', slug: 'the-future' },
  { id: 1003, name: 'true-happiness', slug: 'true-happiness' },
  { id: 1004, name: 'daily-motivation', slug: 'daily-motivation' },
  { id: 1005, name: 'inner-peace', slug: 'inner-peace' },
]

const users = Array.from({ length: 12 }).map((_, i) => ({
  id: 1000 + i,
  name: faker.person.fullName().replace(/'/g, "''"),
  username: faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
  email: faker.internet.email(),
  password: 'Password123!',
  role: 'user',
  is_bot: false,
  is_onboarded: true,
  bio: faker.person.bio().slice(0, 100).replace(/'/g, "''"),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}))

const quotes = Array.from({ length: 50 }).map((_, i) => {
  const user = users[Math.floor(Math.random() * users.length)]
  return {
    id: 1000 + i,
    user_id: user.id,
    content: faker.lorem.paragraph(2).slice(0, 250).replace(/'/g, "''"),
    author: faker.person.fullName().replace(/'/g, "''"),
    source: 'Seeded Data',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
})

let sql = `-- INSERT CATEGORIES\n`
for (const c of categories) {
  sql += `INSERT INTO categories (id, name, slug, color, created_at, updated_at) VALUES (${c.id}, '${c.name}', '${c.slug}', '${c.color}', NOW(), NOW()) ON CONFLICT DO NOTHING;\n`
}

sql += `\n-- INSERT TAGS\n`
for (const t of tags) {
  sql += `INSERT INTO tags (id, name, slug, created_at, updated_at) VALUES (${t.id}, '${t.name}', '${t.slug}', NOW(), NOW()) ON CONFLICT DO NOTHING;\n`
}

sql += `\n-- INSERT USERS\n`
for (const u of users) {
  sql += `INSERT INTO users (id, name, username, email, password, role, is_bot, is_onboarded, bio, created_at, updated_at) VALUES (${u.id}, '${u.name}', '${u.username}', '${u.email}', '${u.password}', '${u.role}', ${u.is_bot}, ${u.is_onboarded}, '${u.bio}', '${u.created_at}', '${u.updated_at}') ON CONFLICT DO NOTHING;\n`
}

sql += `\n-- INSERT QUOTES\n`
for (const q of quotes) {
  sql += `INSERT INTO quotes (id, user_id, content, author, source, created_at, updated_at) VALUES (${q.id}, ${q.user_id}, '${q.content}', '${q.author}', '${q.source}', '${q.created_at}', '${q.updated_at}') ON CONFLICT DO NOTHING;\n`
}

sql += `\n-- ATTACH CATEGORIES AND TAGS TO QUOTES\n`
for (const q of quotes) {
  const numCategories = faker.number.int({ min: 1, max: 2 })
  const quoteCategories = faker.helpers.arrayElements(categories, numCategories)
  for (const c of quoteCategories) {
    sql += `INSERT INTO category_quotes (category_id, quote_id) VALUES (${c.id}, ${q.id}) ON CONFLICT DO NOTHING;\n`
  }

  const numTags = faker.number.int({ min: 1, max: 3 })
  const quoteTags = faker.helpers.arrayElements(tags, numTags)
  for (const t of quoteTags) {
    sql += `INSERT INTO quote_tags (quote_id, tag_id) VALUES (${q.id}, ${t.id}) ON CONFLICT DO NOTHING;\n`
  }
}

fs.writeFileSync('seed.sql', sql)
console.log('✅ Generated seed.sql successfully with integer IDs!')
