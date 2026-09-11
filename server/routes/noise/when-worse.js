import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_WHEN_WORSE,
  redirect: {
    daysWhenWorse: constants.routes.NOISE_DAYS_WHEN_WORSE,
    effectOnDailyLife: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
  }
})
