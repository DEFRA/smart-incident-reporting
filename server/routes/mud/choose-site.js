import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CHOOSE_SITE,
  redirect: {
    chooseAddress: constants.routes.MUD_CHOOSE_ADDRESS,
    confirmSite: constants.routes.MUD_CONFIRM_SITE,
    next: constants.routes.MUD_DESCRIPTION
  }
})
