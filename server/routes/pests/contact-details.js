import constants from '../../utils/constants.js'
import createContactDetailsRoutes from '../rars/contact-details.js'

export default createContactDetailsRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_CONTACT_DETAILS,
  redirect: {
    otherInformation: constants.routes.PESTS_OTHER_INFORMATION
  }
})
