import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SOURCE,
  redirect: constants.routes.NOISE_SOURCE
})
