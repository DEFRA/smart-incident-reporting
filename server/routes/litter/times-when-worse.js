import createTimesWhenWorseRoutes from '../rars/times-when-worse.js'
import constants from '../../utils/constants.js'

export default createTimesWhenWorseRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_TIMES_WHEN_WORSE,
  redirect: {
    effectOnDailyLife: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE
  }
})
