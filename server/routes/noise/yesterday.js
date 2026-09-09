import createYesterdayRoutes from '../rars/yesterday.js'
import constants from '../../utils/constants.js'

export default createYesterdayRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_YESTERDAY,
  redirect: {
    whenWorse: constants.routes.NOISE_WHEN_WORSE
  }
})
