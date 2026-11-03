import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
    confirmSite: constants.routes.LITTER_CONFIRM_SITE,
    next: constants.routes.LITTER_DESCRIPTION
  }
})
