import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_DESCRIPTION,
  redirect: {
    when: constants.routes.DUST_WHEN
  }
})
