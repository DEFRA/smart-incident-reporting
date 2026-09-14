import createDaysWhenWorseRoutes from '../rars/days-when-worse.js'
import constants from '../../utils/constants.js'

export default createDaysWhenWorseRoutes({
  problem: 'mud',
  route: constants.routes.MUD_DAYS_WHEN_WORSE,
  redirect: {
    timesWhenWorse: constants.routes.MUD_TIMES_WHEN_WORSE
  }
})
