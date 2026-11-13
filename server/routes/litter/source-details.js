import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SOURCE_DETAILS,
  redirect: {
    contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY, description: constants.routes.LITTER_DESCRIPTION
  }
})
