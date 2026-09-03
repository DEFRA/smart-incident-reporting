import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_RECURRING,
  redirect: {
    when: constants.routes.LITTER_WHEN
  }
})
