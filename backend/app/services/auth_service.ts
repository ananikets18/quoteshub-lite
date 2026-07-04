import User from '#models/user'

export default class AuthService {
  /**
   * Registers a new user and generates an access token
   */
  async register(payload: any) {
    const user = await User.create({
      name: payload.fullName,
      username: payload.username,
      email: payload.email,
      password: payload.password,
    })
    return { user }
  }

  /**
   * Verifies credentials and generates an access token
   */
  async login(payload: any) {
    const user = await User.verifyCredentials(payload.email, payload.password)
    return { user }
  }

  /**
   * Logs out the user by deleting their current access token
   */
  async logout(user: User) {
    // If we were still supporting API tokens, we'd revoke them here
  }
}
