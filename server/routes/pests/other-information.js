import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.PESTS_REPORT_SENT
  }
})
