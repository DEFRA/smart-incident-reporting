import constants from '../../utils/constants.js'
import createmedicalHealthRoutes from '../rars/medical-help.js'

export default createmedicalHealthRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_MEDICAL_HELP
})