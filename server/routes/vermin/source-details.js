import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.VERMIN_LOCATION_HOME,
    contactLocalCouncil: constants.routes.VERMIN_CONTACT_LOCAL_COUNCIL
  }
})
