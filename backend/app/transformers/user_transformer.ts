import User from '#models/user'

export default class UserTransformer {
  static transform(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      role: user.role,
      isOnboarded: user.isOnboarded,
      initials: user.initials,
      createdAt: user.createdAt?.toISO(),
      updatedAt: user.updatedAt?.toISO(),
    }
  }
}
