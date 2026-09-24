import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.SMELL_LOCATION_HOME,
    contactEnvironmentAgency: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY
  }
})
