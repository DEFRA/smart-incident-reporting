import createWhenWorseRoutes from '../rars/when-worse.js'
import constants from '../../utils/constants.js'

export default createWhenWorseRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_WHEN_WORSE,
  redirect: {
    daysWhenWorse: constants.routes.LITTER_DAYS_WHEN_WORSE
  }
})
