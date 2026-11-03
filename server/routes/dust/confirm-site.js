import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.DUST_CHOOSE_SITE,
    next: constants.routes.DUST_DESCRIPTION
  }
})
