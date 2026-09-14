import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.SMELL_CONTACT_DETAILS
  }
})
