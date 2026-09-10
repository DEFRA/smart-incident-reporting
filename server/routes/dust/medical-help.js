import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'dust',
  route: constants.routes.DUST_MEDICAL_HELP
})
