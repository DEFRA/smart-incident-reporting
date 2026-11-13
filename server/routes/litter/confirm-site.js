import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.LITTER_CHOOSE_SITE,
    sourceDetails: constants.routes.LITTER_SOURCE_DETAILS,
    description: constants.routes.LITTER_DESCRIPTION
  }
})
