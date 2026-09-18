import constants from '../../utils/constants.js'
import createReportLocalCouncilRoutes from '../rars/report-local-council.js'

export default createReportLocalCouncilRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_REPORT_LOCAL_COUNCIL
})
