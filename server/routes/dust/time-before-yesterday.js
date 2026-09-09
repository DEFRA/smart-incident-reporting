import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'dust',
  route: constants.routes.DUST_TIME_BEFORE_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.DUST_WHEN_WORSE
  }
})
