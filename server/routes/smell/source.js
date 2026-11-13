import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    locationHome: constants.routes.SMELL_LOCATION_HOME
  }
})
