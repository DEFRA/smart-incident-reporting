import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_YESTERDAY,
  redirect: {
    smellStrength: constants.routes.SMELL_SMELL_STRENGTH
  }
})
