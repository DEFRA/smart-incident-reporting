import constants from '../../utils/constants.js'
import createReportSentRoutes from '../rars/report-sent.js'

export default createReportSentRoutes({
  problem: 'dust',
  route: constants.routes.DUST_REPORT_SENT
})
