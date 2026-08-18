import constants from '../../utils/constants.js'

const handler = () => ({ status: 'ok' })

export default {
  method: 'GET',
  path: constants.routes.ILLEGAL_FISHING_HEALTH,
  handler,
  options: {
    auth: false
  }
}
