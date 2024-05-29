import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import { randomUUID, type UUID } from 'node:crypto'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Bed from '#models/bed'
import Service from '#models/service'

export const enum Status {
  PREPARE = 'PREPARE',
  ON_TRANSIT = 'ON_TRANSIT',
  FINISH = 'FINISH',
  CANCELED = 'CANCELED',
}

export default class Movement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: UUID

  @column()
  declare notes?: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare bedId?: number

  @hasOne(() => Bed)
  declare bed: HasOne<typeof Bed>

  @column()
  declare serviceId?: number

  @hasOne(() => Service)
  declare service: HasOne<typeof Service>

  @column.dateTime()
  declare begin?: DateTime

  @column.dateTime()
  declare end?: DateTime

  @column()
  declare status: keyof typeof Status

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static beforeCreateMovement(movement: Movement) {
    movement.status = Status.PREPARE
    movement.uuid = randomUUID()
  }
}
