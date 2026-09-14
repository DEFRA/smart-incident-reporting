import createTimesWhenWorseRoutes from '../rars/times-when-worse.js'
import constants from '../../utils/constants.js'

export default createTimesWhenWorseRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_TIMES_WHEN_WORSE,
  redirect: {
    effectOnDailyLife: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
  }
})
