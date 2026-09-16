import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.VERMIN_IMAGES_OR_VIDEO
  }
})
