import createTimeBeforeYesterdayRoutes from '../rars/time-before-yesterday.js'
import constants from '../../utils/constants.js'

export default createTimeBeforeYesterdayRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY,
  redirect: {
    effectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
  }
})
