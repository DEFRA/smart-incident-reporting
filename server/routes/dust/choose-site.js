import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.DUST_CHOOSE_ADDRESS,
    confirmSite: constants.routes.DUST_CONFIRM_SITE,
    next: constants.routes.DUST_DESCRIPTION
  }
})
