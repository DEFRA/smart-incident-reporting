import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_EFFECT_ON_HEALTH,
  redirect: {
    medicalHelp:
    constants.routes.PESTS_MEDICAL_HELP
  }
})
