import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.NOISE_REPORT_SENT
  }
})
