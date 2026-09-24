import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_TIME_BEFORE_YESTERDAY,
  redirect: {
    smellStrength: constants.routes.SMELL_SMELL_STRENGTH
  }
})
