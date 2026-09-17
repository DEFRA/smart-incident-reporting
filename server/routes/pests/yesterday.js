import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_YESTERDAY,
  redirect: {
    effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
  }
})
