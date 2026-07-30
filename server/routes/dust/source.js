import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'dust',
  route: constants.routes.DUST_SOURCE,
  redirect: constants.routes.DUST_SOURCE
})
