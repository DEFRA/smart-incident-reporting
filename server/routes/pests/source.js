import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.PESTS_REPORT_LOCAL_COUNCIL,
    locationHome: constants.routes.PESTS_LOCATION_HOME
  }
})
