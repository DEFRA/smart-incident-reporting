import constants from '../../utils/constants.js'
import createReportSentRoutes from '../rars/report-sent.js'

export default createReportSentRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_REPORT_SENT
})
