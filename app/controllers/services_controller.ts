import Service from '#models/service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ServicesController {
  async getAll({ response }: HttpContext) {
    const services = await Service.all()
    return response.ok(services)
  }
}
