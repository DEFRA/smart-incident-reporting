import createEarlierTodayRoutes from '../rars/earlier-today.js'
import constants from '../../utils/constants.js'

export default createEarlierTodayRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_EARLIER_TODAY,
  redirect: {
    effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
  }
})
