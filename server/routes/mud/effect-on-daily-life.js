import constants from '../../utils/constants.js'
import createEffectOnDailyLifeRoutes from '../rars/effect-on-daily-life.js'

export default createEffectOnDailyLifeRoutes({
  problem: 'mud',
  route: constants.routes.MUD_EFFECT_ON_DAILY_LIFE,
  redirect: {
    effectOnHealth: constants.routes.MUD_EFFECT_ON_HEALTH
  }
})
