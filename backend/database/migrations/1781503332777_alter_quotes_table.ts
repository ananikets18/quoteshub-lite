import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quotes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('views_count').unsigned().defaultTo(0)
      table.integer('impressions_count').unsigned().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('views_count')
      table.dropColumn('impressions_count')
    })
  }
}