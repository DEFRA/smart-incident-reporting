import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_SOURCE_DETAILS,
  redirect: {
    contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY,
    recurring: constants.routes.PESTS_RECURRING
  }
})
