import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_TIME_BEFORE_YESTERDAY,
  redirect: {
    effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
  }
})
