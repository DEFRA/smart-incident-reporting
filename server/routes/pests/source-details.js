import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.PESTS_LOCATION_HOME,
    contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY
  }
})
