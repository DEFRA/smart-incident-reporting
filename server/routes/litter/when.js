import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_WHEN,
  redirect: {
    whenWorse: constants.routes.LITTER_WHEN_WORSE,
    earlierToday: constants.routes.LITTER_EARLIER_TODAY,
    yesterday: constants.routes.LITTER_YESTERDAY,
    dateBeforeYesterday: constants.routes.LITTER_DATE_BEFORE_YESTERDAY
  }
})
