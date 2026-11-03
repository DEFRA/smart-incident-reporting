import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS,
    confirmSite: constants.routes.SMELL_CONFIRM_SITE,
    next: constants.routes.SMELL_DESCRIPTION
  }
})
