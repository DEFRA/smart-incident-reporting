import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.VERMIN_REPORT_SENT
  }
})
