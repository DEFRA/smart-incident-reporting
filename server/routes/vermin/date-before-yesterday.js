import createDateBeforeYesterdayRoutes from '../rars/date-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createDateBeforeYesterdayRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY,
  redirect: {
    timeBeforeYesterday: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY
  }
})
