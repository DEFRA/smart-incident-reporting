import constants from '../../utils/constants.js'
import createEffectOnHealthRoutes from '../../routes/rars/effect-on-health.js'

export default createEffectOnHealthRoutes({
  problem: 'mud',
  route: constants.routes.DUST_EFFECT_ON_HEALTH,
  redirect: { 
    medicalHelp:
    constants.routes.MUD_MEDICAL_HELP
  }
})