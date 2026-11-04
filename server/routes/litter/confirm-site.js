import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONFIRM_SITE
})
