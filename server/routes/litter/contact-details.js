import constants from '../../utils/constants.js'
import createContactDetailsRoutes from '../rars/contact-details.js'

export default createContactDetailsRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONTACT_DETAILS,
  redirect: {
    otherInformation: constants.routes.LITTER_OTHER_INFORMATION
  }
})
