import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.SMELL_CHOOSE_SITE,
    next: constants.routes.SMELL_DESCRIPTION
  }
})
