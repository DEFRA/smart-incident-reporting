import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'dust',
  route: constants.routes.DUST_WHEN,
  redirect: {
    whenWorse: constants.routes.DUST_WHEN_WORSE,
    earlierToday: constants.routes.DUST_EARLIER_TODAY,
    yesterday: constants.routes.DUST_YESTERDAY,
    dateBeforeYesterday: constants.routes.DUST_DATE_BEFORE_YESTERDAY
  }
})
