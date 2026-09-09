import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_EARLIER_TODAY,
  redirect: {
    smellStrength: constants.routes.SMELL_SMELL_STRENGTH
  }
})
