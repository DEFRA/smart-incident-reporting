import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.LITTER_CONTACT_DETAILS
  }
})
