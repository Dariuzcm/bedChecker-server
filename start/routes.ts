/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { UserRoutes } from './routes/userRoutes.js'

router
  .group(() => {
    router
      .group(() => {
        router.get('/', () => 'hello')

        router.group(UserRoutes).prefix('users')
      })
      .prefix('v1')
  })
  .prefix('api')
