import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SOURCE,
  redirect: constants.routes.SMELL_SOURCE
})
