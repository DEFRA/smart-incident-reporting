import constants from '../../utils/constants.js'
import createMedicalHealthRoutes from '../rars/medical-help.js'

export default createMedicalHealthRoutes({
  problem: 'mud',
  route: constants.routes.MUD_MEDICAL_HELP,
  redirect: {
    imagesOrVideo: constants.routes.MUD_IMAGES_OR_VIDEO
  }
})
