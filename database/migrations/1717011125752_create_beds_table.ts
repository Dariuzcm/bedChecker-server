import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'beds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('bed_id')
      table.string('bed_code', 10)
      table.string('description', 50)
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
