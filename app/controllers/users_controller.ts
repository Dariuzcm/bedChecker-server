import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { keyChecker } from '../utils/utils.js'

export default class UsersController {
  async create({ request, response }: HttpContext) {
    const keys = ['fullName', 'email', 'password']
    const fields = request.only(keys)
    const { fullName, email, password } = fields

    const missingKeys = keyChecker(keys, fields)

    if (missingKeys.length > 0) {
      return response.badRequest({
        messages: 'Bad request, missing fields',
        missingKeys,
      })
    }
    const finded = await User.findBy('email', email)
    if (finded) {
      return response.conflict({
        message: 'User Already Exists',
      })
    }
    const user = new User()
    user.fill({
      fullName,
      email,
      password,
    })
    await user.save()
    return user
  }
  async login({ response, request }: HttpContext) {
    const keys = ['email', 'password']
    const fields = request.only(keys)
    const { email, password } = fields

    const missingKeys = keyChecker(keys, fields)
    if (missingKeys.length > 0) {
      return response.badRequest({
        messages: 'Bad request, missing fields',
        missingKeys,
      })
    }

    const user = await User.verifyCredentials(email, password)
    const accessToken = await User.accessTokens.create(user, ['+'], {
      name: 'accessToken',
    })

    return {
      user,
      token: accessToken,
    }
  }
  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const identifer = user.currentAccessToken.identifier
    await User.accessTokens.delete(user, identifer)

    return response.noContent()
  }

  async verificationToken({ request, response }: HttpContext) {
    const { verificationToken } = request.param('verificationToken')
    
  }
}
