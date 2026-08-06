import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.VERMIN_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.VERMIN_REPORT_LOCAL_COUNCIL,
    sourceDetails: constants.routes.VERMIN_SOURCE_DETAILS
  }
})
