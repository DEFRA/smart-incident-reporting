import constants from '../../utils/constants.js'

const handler = () => ({ status: 'ok' })

export default {
  method: 'GET',
  path: constants.routes.NOISE_HEALTH,
  handler,
  options: {
    auth: false
  }
}
