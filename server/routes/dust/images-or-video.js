import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'dust',
  route: constants.routes.DUST_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.DUST_CONTACT_DETAILS
  }
})
