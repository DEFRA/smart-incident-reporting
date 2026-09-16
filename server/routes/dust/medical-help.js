import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'dust',
  route: constants.routes.DUST_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.DUST_IMAGES_OR_VIDEOS
  }
})
