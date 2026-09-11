import constants from '../../utils/constants.js'
import createContactDetailsRoutes from '../rars/contact-details.js'

export default createContactDetailsRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONTACT_DETAILS,
  redirect: {
    otherInformation: constants.routes.NOISE_OTHER_INFORMATION
  }
})
