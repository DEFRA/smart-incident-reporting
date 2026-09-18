import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_RECURRING,
  redirect: {
    when: constants.routes.NOISE_WHEN
  }
})
