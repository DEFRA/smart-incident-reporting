import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.PESTS_CHOOSE_SITE,
    sourceDetails: constants.routes.PESTS_SOURCE_DETAILS,
    recurring: constants.routes.PESTS_RECURRING
  }
})
