import constants from '../../utils/constants.js'
import createEffectOnDailyLifeRoutes from '../rars/effect-on-daily-life.js'

export default createEffectOnDailyLifeRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE,
  redirect: {
    effectOnHealth: constants.routes.NOISE_EFFECT_ON_HEALTH
  }
})
