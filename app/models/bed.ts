import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Bed extends BaseModel {
  @column({ isPrimary: true, columnName: 'bed_id' })
  declare bedId: number

  @column({ columnName: 'bed_code' })
  declare bedCode: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
