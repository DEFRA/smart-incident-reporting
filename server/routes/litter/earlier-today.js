import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_EARLIER_TODAY,
  redirect: {
    whenWorse: constants.routes.LITTER_WHEN_WORSE
  }
})
