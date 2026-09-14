import createDaysWhenWorseRoutes from '../rars/days-when-worse.js'
import constants from '../../utils/constants.js'

export default createDaysWhenWorseRoutes({
  problem: 'dust',
  route: constants.routes.DUST_DAYS_WHEN_WORSE,
  redirect: {
    timesWhenWorse: constants.routes.DUST_TIMES_WHEN_WORSE
  }
})
