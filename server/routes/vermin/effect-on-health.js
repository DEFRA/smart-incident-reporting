import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_EFFECT_ON_HEALTH,
  redirect: {
    medicalHelp:
    constants.routes.VERMIN_MEDICAL_HELP
  }
})
