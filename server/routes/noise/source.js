import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.NOISE_REPORT_LOCAL_COUNCIL,
    sourceDetails: constants.routes.NOISE_SOURCE_DETAILS
  }
})
