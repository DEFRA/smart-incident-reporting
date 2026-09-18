import createDaysWhenWorseRoutes from '../rars/days-when-worse.js'
import constants from '../../utils/constants.js'

export default createDaysWhenWorseRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_DAYS_WHEN_WORSE,
  redirect: {
    timesWhenWorse: constants.routes.NOISE_TIMES_WHEN_WORSE
  }
})
