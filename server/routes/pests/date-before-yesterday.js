import createDateBeforeYesterdayRoutes from '../rars/date-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createDateBeforeYesterdayRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_DATE_BEFORE_YESTERDAY,
  redirect: {
    timeBeforeYesterday: constants.routes.PESTS_TIME_BEFORE_YESTERDAY
  }
})
