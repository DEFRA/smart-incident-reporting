import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.NOISE_CHOOSE_SITE,
    next: constants.routes.NOISE_DESCRIPTION
  }
})
