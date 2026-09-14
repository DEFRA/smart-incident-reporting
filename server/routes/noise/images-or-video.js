import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.NOISE_CONTACT_DETAILS
  }
})
