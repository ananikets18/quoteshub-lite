import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('quotes', (table) => {
      table.index('user_id')
      table.index('created_at')
    })
    
    this.schema.alterTable('notifications', (table) => {
      table.index('user_id')
    })

    this.schema.alterTable('category_quotes', (table) => {
      table.index('category_id')
      table.index('quote_id')
    })

    this.schema.alterTable('quote_tags', (table) => {
      table.index('quote_id')
      table.index('tag_id')
    })
  }

  async down() {
    this.schema.alterTable('quotes', (table) => {
      table.dropIndex('user_id')
      table.dropIndex('created_at')
    })
    
    this.schema.alterTable('notifications', (table) => {
      table.dropIndex('user_id')
    })

    this.schema.alterTable('category_quotes', (table) => {
      table.dropIndex('category_id')
      table.dropIndex('quote_id')
    })

    this.schema.alterTable('quote_tags', (table) => {
      table.dropIndex('quote_id')
      table.dropIndex('tag_id')
    })
  }
}