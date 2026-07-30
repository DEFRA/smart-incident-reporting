import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_SOURCE,
  redirect: constants.routes.VERMIN_SOURCE
})
