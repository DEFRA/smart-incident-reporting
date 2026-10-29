import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'dust',
  route: constants.routes.DUST_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.DUST_REPORT_LOCAL_COUNCIL,
    locationHome: constants.routes.DUST_LOCATION_HOME
  }
})
