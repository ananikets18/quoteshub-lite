import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'categories';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable().unique();
            table.string('slug').notNullable().unique();
            table.text('description').nullable();
            table.string('icon').nullable();
            table.string('color').defaultTo('#6366f1');
            table.boolean('is_active').defaultTo(true);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1780551638290_create_categories_table.js.map