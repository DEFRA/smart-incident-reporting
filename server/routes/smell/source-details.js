import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SOURCE_DETAILS,
  redirect: {
    contactEnvironmentAgency: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY,
    description: constants.routes.SMELL_DESCRIPTION
  }
})
