import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SOURCE_DETAILS,
  redirect: {
    contactEnvironmentAgency: constants.routes.MUD_CONTACT_ENVIRONMENT_AGENCY,
    description: constants.routes.MUD_DESCRIPTION
  }
})
