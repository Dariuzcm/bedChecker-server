import Movement from '#models/movement'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import moment from 'moment'
import { DateTime } from 'luxon'

export default class MovementsController {
  async getAllMovements({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { page = 1, size = 25 } = request.qs()

    const movements = await Movement.query()
      .where('user_id', user.id)
      .andWhereNotNull('service_id')
      .andWhereNotNull('bed_id')
      .preload('service', (postQuery) => {
        postQuery.whereNotNull('service_id')
      })
      .preload('bed', (postQuery) => {
        postQuery.whereNotNull('bed_id')
      })
      .paginate(page, size)

    return response.ok(movements)
  }

  async getWeekMovements({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const actual = moment()
    const now = moment()
    const fiveDaysAgo = now.subtract(5, 'days')

    const movements = await Movement.query()
      .where('user_id', user.id)
      .andWhereNotNull('service_id')
      .andWhereNotNull('bed_id')
      .whereBetween('end', [
        fiveDaysAgo.format('YYYY-MM-DD HH:MM:ss'),
        actual.format('YYYY-MM-DD HH:MM:ss'),
      ])
      .preload('service', (postQuery) => {
        postQuery.whereNotNull('service_id')
      })
      .preload('bed', (postQuery) => {
        postQuery.whereNotNull('bed_id')
      })

    return response.ok(movements)
  }

  async create({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const attributes = request.body()
    logger.info(attributes)
    const movement = new Movement()
    movement.fill({
      ...attributes,
      userId: user.id,
    })
    await movement.save()

    return response.ok(movement)
  }

  async getLast({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const movement = await Movement.query()
      .where('user_id', user.id)
      .andWhereNotNull('service_id')
      .andWhereNotNull('bed_id')
      .orderBy('id', 'desc')
      .first()
    if (!movement) {
      return response.notFound()
    }
    await movement.load('bed')
    await movement.load('service')
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

  async cancelMovement({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const movementUuid = request.param('movementUuid')
    const movement = await Movement.findByOrFail('id', movementUuid)
    logger.info(movement)
    if (user.id !== movement.userId && user.type !== 'admin') {
      return response.abort('User are not the same')
    }

    movement.status = 'CANCELED'
    movement.end = DateTime.now()

    await movement.save()

    return response.noContent()
  }
}
