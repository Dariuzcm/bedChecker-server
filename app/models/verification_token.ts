import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class VerificationToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare token: number

  @column()
  declare checked: boolean

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @column({ columnName: 'user_id' })
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async createToken(verification: VerificationToken) {
    let token = Math.random() * 100000
    verification.token = token
  }
}
