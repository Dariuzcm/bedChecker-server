/* eslint-disable unicorn/filename-case */
import router from '@adonisjs/core/services/router'
// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
import VerificationTokensController from '#controllers/verification_tokens_controller'

export const ValidationRoutes = () => {
  router.post('/create', [VerificationTokensController, 'createToken'])
  router.post('/validate', [VerificationTokensController, 'verificateToken'])
}
