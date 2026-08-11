import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.MUD_LOCATION_HOME,
    contactLocalCouncil: constants.routes.MUD_CONTACT_LOCAL_COUNCIL
  }
})
