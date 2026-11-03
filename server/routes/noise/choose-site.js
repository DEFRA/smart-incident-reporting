import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
    confirmSite: constants.routes.NOISE_CONFIRM_SITE,
    next: constants.routes.NOISE_DESCRIPTION
  }
})
