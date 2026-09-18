import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.LITTER_LOCATION_HOME,
    contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY
  }
})
