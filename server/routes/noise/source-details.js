import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SOURCE_DETAILS,
  redirect: {
    contactEnvironmentAgency: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY,
    description: constants.routes.NOISE_DESCRIPTION
  }
})
