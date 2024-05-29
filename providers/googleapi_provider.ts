import type { ApplicationService } from '@adonisjs/core/types'
import { google } from 'googleapis'
// @ts-ignore
import apikey from '../sources/bedchecker.json' assert { type: 'json' }
import User from '#models/user'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'node:fs'
import logger from '@adonisjs/core/services/logger'

export default class GoogleapiProvider {
  constructor(protected app: ApplicationService) {}
  SCOPE = ['https://www.googleapis.com/auth/drive']
  static googleAuth: any
  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    // const jwtClient = new google.auth.JWT(
    //   apikey.client_email,
    //   undefined,
    //   apikey.private_key,
    //   this.SCOPE
    // )
    // const credentials = await jwtClient.authorize()

    try {
      // const auth = google.auth.fromJSON(apikey)
      const client = new google.auth.GoogleAuth({
        credentials: apikey,
        scopes: this.SCOPE,
      })
      GoogleapiProvider.googleAuth = client
    } catch (error) {
      logger.error(error.message)
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}

  static async updateFile(user: User, multipartFile: MultipartFile) {
    const drive = google.drive({ version: 'v3', auth: this.googleAuth })
    const path = multipartFile.tmpPath
    try {
      const exist = await drive.files.get({
        fileId: user.photoId,
      })
      if (exist) {
        drive.files.delete({
          fileId: user.photoId,
        })
      }
    } catch (error) {
      logger.warn(error, error.message)
    }

    if (path) {
      const file = fs.createReadStream(path)
      const requestBody = {
        name: user.id.toString(),
        parents: ['1ks7K0-Uqh0IMO3wHeAEs07jl6DFJMoqq'],
      }
      const media = {
        mimeType: `${multipartFile.type}/${multipartFile.subtype}`,
        body: file,
      }
      try {
        const fileUploaded = await drive.files.create(
          {
            requestBody,
            media,
            fields: 'id,name',
          },
          {
            headers: {
              Authorization: `Bearer ${GoogleapiProvider.googleAuth.accessToken}`,
            },
          }
        )
        return fileUploaded
      } catch (error) {
        logger.error(error, error.message)
      }
    }
  }

  static async getFile(identifer: string) {
    const drive = google.drive({ version: 'v3', auth: this.googleAuth })
    try {
      const exist = await drive.files.get({
        fileId: identifer,
        alt: 'media',
      })
      return exist
    } catch (error) {
      logger.warn(error, error.message)
    }
  }
}
