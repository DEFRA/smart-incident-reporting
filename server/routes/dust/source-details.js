import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'dust',
  route: constants.routes.DUST_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.DUST_LOCATION_HOME,
    contactLocalCouncil: constants.routes.DUST_CONTACT_LOCAL_COUNCIL
  }
})
