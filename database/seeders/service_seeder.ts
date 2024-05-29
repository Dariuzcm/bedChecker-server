import { BaseSeeder } from '@adonisjs/lucid/seeders'
import serviceSource from './seedersSource/services.json' assert { type: 'json' }
import Service from '#models/service'

export default class extends BaseSeeder {
  async run() {
    await Service.createMany(serviceSource)
  }
}
