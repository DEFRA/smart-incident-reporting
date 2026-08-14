import constants from '../../utils/constants.js'
import createSourceDetailsRoutes from '../rars/source-details.js'

export default createSourceDetailsRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SOURCE_DETAILS,
  redirect: {
    locationHome: constants.routes.NOISE_LOCATION_HOME,
    contactLocalCouncil: constants.routes.NOISE_CONTACT_LOCAL_COUNCIL
  }
})
