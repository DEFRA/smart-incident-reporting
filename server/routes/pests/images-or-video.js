import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.PESTS_CONTACT_DETAILS
  }
})
