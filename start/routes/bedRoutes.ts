/* eslint-disable unicorn/filename-case */

const BedsController = () => import('#controllers/beds_controller')
import router from '@adonisjs/core/services/router'

export const BedRoutes = () => {
  router.get('/', [BedsController, 'getAll'])
}
