import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'dust',
  route: constants.routes.DUST_EFFECT_ON_HEALTH
})
