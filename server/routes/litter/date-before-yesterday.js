import createDateBeforeYesterdayRoutes from '../rars/date-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createDateBeforeYesterdayRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_DATE_BEFORE_YESTERDAY,
  redirect: {
    timeBeforeYesterday: constants.routes.LITTER_TIME_BEFORE_YESTERDAY
  }
})
