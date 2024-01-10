import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import config from '../utils/config.js'

const cache = [{
  name: 'redis_cache',
  provider: {
    constructor: CatboxRedis,
    options: {
      partition: 'webapp',
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword,
      tls: JSON.parse(config.redisTls) ? { checkServerIdentity: () => undefined } : undefined
    }
  }
}]

export default cache
