import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CHOOSE_SITE,
  redirect: {
    confirmSite: constants.routes.MUD_CONFIRM_SITE,
    manualSite: constants.routes.MUD_SOURCE_DETAILS
  }
})
