import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_EARLIER_TODAY,
  redirect: {
    whenWorse: constants.routes.NOISE_WHEN_WORSE
  }
})
