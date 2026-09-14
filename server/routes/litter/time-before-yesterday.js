import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_TIME_BEFORE_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.LITTER_WHEN_WORSE
  }
})
