import constants from '../../utils/constants.js'
import createReportSentRoutes from '../rars/report-sent.js'

export default createReportSentRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_REPORT_SENT
})
