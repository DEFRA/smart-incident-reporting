import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'dust',
  route: constants.routes.DUST_EARLIER_TODAY,
  redirect: {
    whenWorse: constants.routes.DUST_WHEN_WORSE
  }
})
