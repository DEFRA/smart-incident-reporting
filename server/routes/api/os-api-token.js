import constants from '../../utils/constants.js'
import config from '../../utils/config.js'
import getBearerToken from '../../utils/get-bearer-token.js'

const bearerConfig = {
  url: 'https://api.os.uk/oauth2/token/v1',
  clientId: config.osKey,
  clientSecret: config.osSecret
}

const getToken = async request => {
  const bearerToken = await getBearerToken(bearerConfig)
  request.logger.info('Got bearer token')
  return bearerToken
}

export default {
  method: 'GET',
  path: constants.routes.API_OS_API_TOKEN,
  handler: getToken,
  options: {
    auth: false
  }
}
