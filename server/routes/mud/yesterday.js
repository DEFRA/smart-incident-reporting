import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'mud',
  route: constants.routes.MUD_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.MUD_WHEN_WORSE
  }
})
