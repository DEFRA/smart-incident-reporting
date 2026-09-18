import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_EFFECT_ON_HEALTH,
  redirect: {
    medicalHelp:
    constants.routes.SMELL_MEDICAL_HELP
  }
})
