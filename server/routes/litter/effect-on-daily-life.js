import constants from '../../utils/constants.js'
import createEffectOnDailyLifeRoutes from '../rars/effect-on-daily-life.js'

export default createEffectOnDailyLifeRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE,
  redirect: {
    effectOnHealth: constants.routes.LITTER_EFFECT_ON_HEALTH
  }
})
