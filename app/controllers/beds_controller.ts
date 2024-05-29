import Bed from '#models/bed'
import type { HttpContext } from '@adonisjs/core/http'

export default class BedsController {
  async getAll({ response }: HttpContext) {
    const beds = await Bed.all()
    return response.ok(beds)
  }
}
