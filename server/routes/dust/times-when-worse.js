import createTimesWhenWorseRoutes from '../rars/times-when-worse.js'
import constants from '../../utils/constants.js'

export default createTimesWhenWorseRoutes({
  problem: 'dust',
  route: constants.routes.DUST_TIMES_WHEN_WORSE,
  redirect: {
    effectOnDailyLife: constants.routes.DUST_EFFECT_ON_DAILY_LIFE
  }
})
