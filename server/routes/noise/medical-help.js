import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.NOISE_IMAGES_OR_VIDEO
  }
})
