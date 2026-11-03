import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.PESTS_CHOOSE_ADDRESS,
    confirmSite: constants.routes.PESTS_CONFIRM_SITE,
    next: constants.routes.PESTS_RECURRING
  }
})
