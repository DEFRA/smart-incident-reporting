import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'dust',
  route: constants.routes.DUST_WHEN_WORSE,
  redirect: {
    daysWhenWorse: constants.routes.DUST_DAYS_WHEN_WORSE,
    effectOnDailyLife: constants.routes.DUST_EFFECT_ON_DAILY_LIFE
  }
})
