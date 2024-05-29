import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('photo', 255)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
