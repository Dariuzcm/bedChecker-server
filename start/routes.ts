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
import { ValidationRoutes } from './routes/validationRoutes.js'
import { BedRoutes } from './routes/bedRoutes.js'
import { ServiceRoutes } from './routes/serviceRoutes.js'

router
  .group(() => {
    router
      .group(() => {
        router.get('/', () => 'hello')
        router.group(UserRoutes).prefix('users')
        router.group(ValidationRoutes).prefix('validation')
        router.group(BedRoutes).prefix('beds')
        router.group(ServiceRoutes).prefix('services')
      })
      .prefix('v1')
  })
  .prefix('api')
