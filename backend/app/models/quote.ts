import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Like from './like.js'
import Save from './save.js'
import Category from './category.js'
import Tag from './tag.js'

export default class Quote extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare likesCount: number

  @column()
  declare viewsCount: number

  @column()
  declare impressionsCount: number

  @column()
  declare userId: number

  @column()
  declare content: string

  @column()
  declare author: string | null

  @column()
  declare source: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Save)
  declare saves: HasMany<typeof Save>

  @manyToMany(() => Category, { pivotTable: 'category_quotes' })
  declare categories: ManyToMany<typeof Category>

  @manyToMany(() => Tag, { pivotTable: 'quote_tags' })
  declare tags: ManyToMany<typeof Tag>
}