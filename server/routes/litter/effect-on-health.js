import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_EFFECT_ON_HEALTH,
  redirect: {
    medicalHelp:
    constants.routes.LITTER_MEDICAL_HELP
  }
})
