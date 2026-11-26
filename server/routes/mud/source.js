import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SOURCE,
  redirect: {
    contactEnvironmentAgency: constants.routes.MUD_CONTACT_ENVIRONMENT_AGENCY,
    localCouncil: constants.routes.MUD_REPORT_LOCAL_COUNCIL,
    locationHome: constants.routes.MUD_LOCATION_HOME
  }
})
