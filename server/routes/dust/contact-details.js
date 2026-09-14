import constants from '../../utils/constants.js'
import createContactDetailsRoutes from '../rars/contact-details.js'

export default createContactDetailsRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CONTACT_DETAILS,
  redirect: {
    otherInformation: constants.routes.DUST_OTHER_INFORMATION
  }
})
