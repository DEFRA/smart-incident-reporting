import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_WHEN,
  redirect: {
    effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE,
    earlierToday: constants.routes.PESTS_EARLIER_TODAY,
    yesterday: constants.routes.PESTS_YESTERDAY,
    dateBeforeYesterday: constants.routes.PESTS_DATE_BEFORE_YESTERDAY
  }
})
