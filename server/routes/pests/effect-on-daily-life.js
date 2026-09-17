import createEffectOnDailyLifeRoutes from '../rars/effect-on-daily-life.js'
import constants from '../../utils/constants.js'

export default createEffectOnDailyLifeRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE,
  redirect: {
    effectOnHealth: constants.routes.PESTS_EFFECT_ON_HEALTH
  }
})
