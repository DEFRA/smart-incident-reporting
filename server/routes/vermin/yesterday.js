import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_YESTERDAY,
  redirect: {
    effectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
  }
})
