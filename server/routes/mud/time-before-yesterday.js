import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'mud',
  route: constants.routes.MUD_TIME_BEFORE_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.MUD_WHEN_WORSE
  }
})
