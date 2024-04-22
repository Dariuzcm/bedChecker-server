import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class VerificationToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare token: number

  @column()
  declare checked: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async createToken(verification: VerificationToken) {
    let token = Math.random() * 100000
    verification.token = token
    verification.save()
  }
}
