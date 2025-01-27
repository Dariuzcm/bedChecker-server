import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 days',
    prefix: 'atoken_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: 'name' })
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare verificated: boolean

  @column({ serializeAs: null })
  declare password: string

  @column({ columnName: 'employee_number' })
  declare employeeNumber: number

  @column({ columnName: 'photo' })
  declare photo: string

  @column({ columnName: 'photo_id' })
  declare photoId: string

  @column()
  declare inactive: boolean

  @column({ serializeAs: null })
  declare type: 'admin' | 'normal'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
