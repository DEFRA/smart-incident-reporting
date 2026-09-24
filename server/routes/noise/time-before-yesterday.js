import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_TIME_BEFORE_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.NOISE_WHEN_WORSE
  }
})
