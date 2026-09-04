import constants from '../../utils/constants.js'
import createEffectONHealthroutes from '../../routes/rars/effect-on-health.js'

export default createEffectONHealthroutes({
  problem: 'dust',
  route: constants.routes.DUST_EFFECT_ON_HEALTH
})