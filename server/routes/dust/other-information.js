import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'dust',
  route: constants.routes.DUST_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.DUST_REPORT_SENT
  }
})
