import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('inactive').after('password').nullable()
      table.integer('employee_number', 25).after('password').nullable()
      table.unique('email')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
