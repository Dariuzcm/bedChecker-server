import type { HttpContext } from '@adonisjs/core/http'

export default class MovementsController {
  async getAllMovements({ auth, request, response }: HttpContext) {
    const user = auth.authenticate()
    const { page = 1, size = 25 } = request.qs()
    console.log(page, size)
  }
}
