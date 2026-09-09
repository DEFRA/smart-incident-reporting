import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'mud',
  route: constants.routes.MUD_EARLIER_TODAY,
  redirect: {
    whenWorse: constants.routes.MUD_WHEN_WORSE
  }
})
