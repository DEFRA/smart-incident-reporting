import constants from '../../../utils/constants.js'

describe('litter/report-local-council', () => {
  it('Should call createReportLocalCouncilRoutes with correct config', () => {
    const createReportLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/report-local-council.js', () => ({
        __esModule: true,
        default: createReportLocalCouncilRoutes
      }))
      require('../../litter/report-local-council.js')
    })
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_REPORT_LOCAL_COUNCIL
    })
  })
})
