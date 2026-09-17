import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_WHEN_WORSE,
  redirect: {
    effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
  }
})
