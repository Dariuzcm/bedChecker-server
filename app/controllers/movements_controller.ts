import Movement from '#models/movement'
import type { HttpContext } from '@adonisjs/core/http'

export default class MovementsController {
  async getAllMovements({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { page = 1, size = 25 } = request.qs()

    const movements = await Movement.query().where('user_id', user.id).paginate(page, size)

    return response.ok(movements)
  }
  async create({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const attributes: Pick<Movement, 'notes' | 'bedId' | 'serviceId' | 'begin' | 'end'> =
      request.body() as Movement['$attributes']

    const movement = new Movement()
    movement.fill({
      ...attributes,
      userId: user.id,
    })
    await movement.save()

    return response.ok(movement)
  }

  async update({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const movementUuid = request.param('movementUuid')
    const attributes: Partial<Movement> = request.body()

    const movement = await Movement.query()
      .where('uuid', movementUuid)
      .andWhere('user_id', user.id)
      .firstOrFail()

    movement.merge(attributes)
    await movement.save()

    return response.ok(movement)
  }
}
