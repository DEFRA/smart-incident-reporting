import constants from '../../utils/constants.js'
import createOtherInformationRoutes from '../rars/other-information.js'

export default createOtherInformationRoutes({
  problem: 'mud',
  route: constants.routes.MUD_OTHER_INFORMATION,
  redirect: {
    reportSent: constants.routes.MUD_REPORT_SENT
  }
})
