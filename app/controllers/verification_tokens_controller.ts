import User from '#models/user'
import VerificationToken from '#models/verification_token'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class VerificationTokensController {
  async createToken({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (!user)
      return response.unauthorized({
        message: 'No Authorized',
      })

    const verification = new VerificationToken()
    verification.userId = user.id
    await verification.save()

    await mail.send((message) => {
      message
        .to(user.email)
        .from('cecilia.klein39@ethereal.email', 'no-reply')
        .subject('BedChecker validation token').html(`
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="flex flex-col gap-3 p-6">
            <p>
              Hola querido usuario ${user.fullName} te mando este codigo de verificación 
              para que puedas validar tu cuenta
              en BedChecker
            </p>
            <h4 class="text-lg">
              Verification code: <span class="font-bold">${Math.floor(verification.token)}</span>
            </h4>
          </div>
        </body>
      </html>
      `)
    })
    return response.noContent()
  }

  async verificateToken({ auth, request, response }: HttpContext) {
    const user = (await auth.authenticate()) as User
    if (!user)
      return response.unauthorized({
        message: 'No Authorized',
      })
    const { verificationToken } = request.only(['verificationToken'])

    const verification = await VerificationToken.query()
      .where('user_id', user.id)
      .andWhere((query) => query.where('checked', false))
      .orderBy('id', 'desc')
      .firstOrFail()

    if (verification.token !== Number(verificationToken))
      return response.abort({ messages: 'Invalid Token' })

    user.verificated = true
    verification.checked = true

    await user.save()
    await verification.save()

    return response.noContent()
  }
}
