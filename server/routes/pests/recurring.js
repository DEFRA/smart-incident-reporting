import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_RECURRING,
  redirect: {
    when: constants.routes.PESTS_WHEN
  }
})
