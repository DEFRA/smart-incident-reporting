import constants from '../../utils/constants.js'
import createReportSentRoutes from '../rars/report-sent.js'

export default createReportSentRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_REPORT_SENT
})
