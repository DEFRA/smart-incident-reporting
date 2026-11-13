import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CHOOSE_SITE,
  redirect: {
    confirmSite: constants.routes.NOISE_CONFIRM_SITE,
    manualSite: constants.routes.NOISE_SOURCE_DETAILS
  }
})
