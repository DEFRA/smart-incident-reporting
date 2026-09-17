import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.PESTS_IMAGES_OR_VIDEO
  }
})
