import constants from '../../utils/constants.js'
import { createImagesOrVideoRoutes } from '../rars/images-or-video.js'

export default createImagesOrVideoRoutes({
  problem: 'mud',
  route: constants.routes.MUD_IMAGES_OR_VIDEO,
  redirect: {
    contactDetails: constants.routes.MUD_CONTACT_DETAILS
  }
})
