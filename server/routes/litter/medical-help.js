import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.LITTER_IMAGES_OR_VIDEO
  }
})
