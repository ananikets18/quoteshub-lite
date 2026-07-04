import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(50),
    bio: vine.string().trim().maxLength(200).optional(),
  })
)
