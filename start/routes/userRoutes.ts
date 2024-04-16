/* eslint-disable unicorn/filename-case */
import router from '@adonisjs/core/services/router'
// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
import UsersController from '#controllers/users_controller'

export const UserRoutes = () => {
  router.post('/create', [UsersController, 'create'])
  router.post('/login', [UsersController, 'login'])
  router.post('/logout', [UsersController, 'logout'])
}
