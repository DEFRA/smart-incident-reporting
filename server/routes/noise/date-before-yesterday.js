import createDateBeforeYesterdayRoutes from '../rars/date-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createDateBeforeYesterdayRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_DATE_BEFORE_YESTERDAY,
  redirect: {
    timeBeforeYesterday: constants.routes.NOISE_TIME_BEFORE_YESTERDAY
  }
})
