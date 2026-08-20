import constants from '../../utils/constants.js'
import createDescriptionRoutes from '../rars/description.js'

export default createDescriptionRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_DESCRIPTION,
  redirect: {
    recurring: constants.routes.LITTER_RECURRING
  }
})
