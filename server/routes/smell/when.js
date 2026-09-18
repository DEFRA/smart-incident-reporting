import constants from '../../utils/constants.js'
import createWhenRoutes from '../rars/when.js'

export default createWhenRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_WHEN,
  redirect: {
    smellStrength: constants.routes.SMELL_SMELL_STRENGTH,
    earlierToday: constants.routes.SMELL_EARLIER_TODAY,
    yesterday: constants.routes.SMELL_YESTERDAY,
    dateBeforeYesterday: constants.routes.SMELL_DATE_BEFORE_YESTERDAY
  }
})
