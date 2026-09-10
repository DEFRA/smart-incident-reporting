import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_EFFECT_ON_HEALTH,
  redirect: {
    medicalHelp:
    constants.routes.NOISE_MEDICAL_HELP
  }
})
