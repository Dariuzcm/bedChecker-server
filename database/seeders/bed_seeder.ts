import { BaseSeeder } from '@adonisjs/lucid/seeders'
import beds from '../seedersSource/beds.json' assert { type: 'json' }
import Bed from '#models/bed'

export default class extends BaseSeeder {
  async run() {
    await Bed.createMany(beds)
  }
}
