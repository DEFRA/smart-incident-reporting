import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_WHEN,
  redirect: {
    effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
    earlierToday: constants.routes.VERMIN_EARLIER_TODAY,
    yesterday: constants.routes.VERMIN_YESTERDAY,
    dateBeforeYesterday: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY
  }
})
