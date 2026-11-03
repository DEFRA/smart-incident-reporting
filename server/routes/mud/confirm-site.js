import constants from '../../utils/constants.js'
import createConfirmSiteRoutes from '../rars/confirm-site.js'

export default createConfirmSiteRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CONFIRM_SITE,
  redirect: {
    chooseSite: constants.routes.MUD_CHOOSE_SITE,
    next: constants.routes.MUD_DESCRIPTION
  }
})
