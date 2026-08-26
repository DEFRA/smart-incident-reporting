import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_RECURRING,
  redirect: {
    when: constants.routes.VERMIN_WHEN
  }
})
