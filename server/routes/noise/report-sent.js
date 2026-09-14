import constants from '../../utils/constants.js'
import createReportSentRoutes from '../rars/report-sent.js'

export default createReportSentRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_REPORT_SENT
})
