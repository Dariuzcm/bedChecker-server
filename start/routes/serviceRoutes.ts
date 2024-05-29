/* eslint-disable unicorn/filename-case */
const ServicesController = () => import('#controllers/services_controller')
import router from '@adonisjs/core/services/router'

export const ServiceRoutes = () => {
  router.get('/', [ServicesController, 'getAll'])
}
