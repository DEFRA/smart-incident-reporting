import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SOURCE,
  redirect: constants.routes.LITTER_SOURCE
})
