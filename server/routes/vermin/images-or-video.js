import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.VERMIN_CONTACT_DETAILS
  }
})
