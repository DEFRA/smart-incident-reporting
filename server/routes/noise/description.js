import constants from '../../utils/constants.js'
import createDescriptionRoutes from '../rars/description.js'

export default createDescriptionRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_DESCRIPTION,
  redirect: {
    recurring: constants.routes.NOISE_RECURRING
  }
})
