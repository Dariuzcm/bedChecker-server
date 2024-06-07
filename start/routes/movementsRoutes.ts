/* eslint-disable unicorn/filename-case */

const Movements = () => import('#controllers/movements_controller')
import router from '@adonisjs/core/services/router'

export const MovementsRoutes = () => {
  router.post('/', [Movements, 'create'])
  router.get('/', [Movements, 'getAllMovements'])
  router.get('/last', [Movements, 'getLast'])
  router.get('/week', [Movements, 'getWeekMovements'])
  router.put('/:movementUuid', [Movements, 'update'])
  router.delete('/:movementUuid', [Movements, 'cancelMovement'])
}
