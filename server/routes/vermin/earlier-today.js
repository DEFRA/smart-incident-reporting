import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_EARLIER_TODAY,
  redirect: {
    effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
  }
})
