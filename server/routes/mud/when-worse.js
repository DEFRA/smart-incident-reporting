import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'mud',
  route: constants.routes.MUD_WHEN_WORSE,
  redirect: {
    daysWhenWorse: constants.routes.MUD_DAYS_WHEN_WORSE,
    effectOnDailyLife: constants.routes.MUD_EFFECT_ON_DAILY_LIFE
  }
})
