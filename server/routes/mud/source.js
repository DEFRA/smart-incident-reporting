import constants from '../../utils/constants.js'
import createSourceRoutes from '../rars/source.js'

export default createSourceRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SOURCE,
  redirect: constants.routes.MUD_SOURCE
})
