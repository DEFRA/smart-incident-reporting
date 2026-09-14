import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'dust',
  route: constants.routes.DUST_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.DUST_WHEN_WORSE
  }
})
