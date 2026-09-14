import createEffectOnDailyLifeRoutes from '../rars/effect-on-daily-life.js'
import constants from '../../utils/constants.js'

export default createEffectOnDailyLifeRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
  redirect: {
    effectOnHealth: constants.routes.VERMIN_EFFECT_ON_HEALTH
  }
})
