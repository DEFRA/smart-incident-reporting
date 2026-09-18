import constants from '../../utils/constants.js'
import createRecurringRoutes from '../rars/recurring.js'

export default createRecurringRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_RECURRING,
  redirect: {
    when: constants.routes.SMELL_WHEN
  }
})
