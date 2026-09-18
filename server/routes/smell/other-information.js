import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.SMELL_REPORT_SENT
  }
})
