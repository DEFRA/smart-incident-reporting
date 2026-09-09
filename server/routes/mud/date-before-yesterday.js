import createDateBeforeYesterdayRoutes from '../rars/date-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createDateBeforeYesterdayRoutes({
  problem: 'mud',
  route: constants.routes.MUD_DATE_BEFORE_YESTERDAY,
  redirect: {
    timeBeforeYesterday: constants.routes.MUD_TIME_BEFORE_YESTERDAY
  }
})
