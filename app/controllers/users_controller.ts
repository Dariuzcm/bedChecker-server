import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { keyChecker } from '../utils/utils.js'
import GoogleapiProvider from '#providers/googleapi_provider'
import logger from '@adonisjs/core/services/logger'

export default class UsersController {
  async create({ request, response }: HttpContext) {
    const keys = ['name', 'email', 'password', 'employeeNumber']
    const fields = request.only(keys)
    const { name: fullName, email, password, employeeNumber } = fields

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
      employeeNumber,
    })
    await user.save()
    const logged = await User.verifyCredentials(email, password)
    const accessToken = await User.accessTokens.create(user, ['*'])
    return {
      user: logged,
      token: accessToken,
    }
  }

  async update({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const toUpdate = request.body()

    user.fullName = toUpdate.name
    user.email = toUpdate.email
    user.employeeNumber = toUpdate.employeeNumber

    await user.save()

    return response.ok(user)
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
    const accessToken = await User.accessTokens.create(user, ['*'], {
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

  async refreshUser({ auth }: HttpContext) {
    const user: User = (await auth.authenticate()) as User
    return user
  }

  async savePicture({ auth, request, response }: HttpContext) {
    const user = (await auth.authenticate()) as User
    const file = await request.file('avatar')
    if (file) {
      const photoRef = await GoogleapiProvider.updateFile(user, file)
      if (photoRef?.data.id) {
        user.photoId = photoRef.data.id
        user.photo = photoRef.data.id
        await user.save()
      }
    }
    return response.accepted(user)
  }

  async getAvatar({ response, request }: HttpContext) {
    const identifer = request.param('photoId')

    const img = await GoogleapiProvider.getFile(identifer)

    if (img?.data) {
      const blob: Blob = img?.data as unknown as Blob
      //@ts-ignore
      return response.stream(blob.stream())
    } else {
      return response.notFound()
    }
  }
}
