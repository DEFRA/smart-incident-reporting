import constants from '../../utils/constants.js'
import createmedicalHealthRoutes from '../rars/medical-help.js'

export default createmedicalHealthRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_MEDICAL_HELP
})
