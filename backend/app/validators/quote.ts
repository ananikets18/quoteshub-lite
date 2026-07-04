import vine from '@vinejs/vine'

/**
 * Validator to use when submitting a new quote
 */
export const createQuoteValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(5).maxLength(2000),
    author: vine.string().trim().maxLength(255).optional(),
    source: vine.string().trim().maxLength(255).optional(),
    categoryIds: vine.array(vine.number()).optional(),
    tagIds: vine.array(vine.number()).optional(),
  })
)

export const updateQuoteValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(5).maxLength(2000).optional(),
    author: vine.string().trim().maxLength(255).optional(),
    source: vine.string().trim().maxLength(255).optional(),
    categoryIds: vine.array(vine.number()).optional(),
    tagIds: vine.array(vine.number()).optional(),
  })
)
