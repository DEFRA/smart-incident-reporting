import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.LITTER_REPORT_LOCAL_COUNCIL,
    locationHome: constants.routes.LITTER_LOCATION_HOME
  }
})
