import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {


  async up() {
    this.schema.alterTable('password_resets', (table) => {
      table.index('token')
    })
  }

  async down() {
    this.schema.alterTable('password_resets', (table) => {
      table.dropIndex('token')
    })
  }
}