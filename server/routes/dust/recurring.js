import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'dust',
  route: constants.routes.DUST_RECURRING,
  redirect: {
    when: constants.routes.DUST_WHEN
  }
})
