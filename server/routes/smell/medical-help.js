import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.SMELL_IMAGES_OR_VIDEO
  }
})
