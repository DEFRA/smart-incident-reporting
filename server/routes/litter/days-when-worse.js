import createDaysWhenWorseRoutes from '../rars/days-when-worse.js'
import constants from '../../utils/constants.js'

export default createDaysWhenWorseRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_DAYS_WHEN_WORSE,
  redirect: {
    timesWhenWorse: constants.routes.LITTER_TIMES_WHEN_WORSE
  }
})
