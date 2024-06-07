import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid')
      table.string('notes').nullable()
      table.integer('bed_id', 10).unsigned().nullable().references('beds.bed_id')
      table.integer('service_id', 10).unsigned().nullable().references('services.service_id')
      table.integer('user_id', 10).unsigned().nullable().references('users.id')
      table.dateTime('begin').nullable()
      table.dateTime('end').nullable()
      table
        .enu('status', ['PREPARE', 'ON_TRANSIT', 'FINISH', 'CANCELED', 'ON_RETURNING'])
        .notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
