import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { UserRole } from '#enums/user_role'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Quote from './quote.js'
import Like from './like.js'
import Save from './save.js'
import Notification from './notification.js'

export default class User extends compose(BaseModel, withAuthFinder(hash)) {
  @hasMany(() => Quote)
  declare quotes: HasMany<typeof Quote>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Save)
  declare saves: HasMany<typeof Save>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare avatar: string | null

  @column()
  declare role: UserRole

  @column()
  declare isBot: boolean

  @column()
  declare isOnboarded: boolean

  @column()
  declare bio: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  get initials() {
    const [first, last] = this.name ? this.name.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
