import constants from '../../utils/constants.js'
import createContactDetailsRoutes from '../rars/contact-details.js'

export default createContactDetailsRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_CONTACT_DETAILS,
  redirect: {
    otherInformation: constants.routes.VERMIN_OTHER_INFORMATION
  }
})
