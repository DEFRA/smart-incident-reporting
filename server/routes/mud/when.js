import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'mud',
  route: constants.routes.MUD_WHEN,
  redirect: {
    whenWorse: constants.routes.MUD_WHEN_WORSE,
    earlierToday: constants.routes.MUD_EARLIER_TODAY,
    yesterday: constants.routes.MUD_YESTERDAY,
    dateBeforeYesterday: constants.routes.MUD_DATE_BEFORE_YESTERDAY
  }
})
