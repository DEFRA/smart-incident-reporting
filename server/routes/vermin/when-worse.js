import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_WHEN_WORSE,
  redirect: {
    locationDescription: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
  }
})
