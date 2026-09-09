import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_WHEN,
  redirect: {
    whenWorse: constants.routes.NOISE_WHEN_WORSE,
    earlierToday: constants.routes.NOISE_EARLIER_TODAY,
    yesterday: constants.routes.NOISE_YESTERDAY,
    dateBeforeYesterday: constants.routes.NOISE_DATE_BEFORE_YESTERDAY
  }
})
