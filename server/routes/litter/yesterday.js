import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.LITTER_WHEN_WORSE
  }
})
