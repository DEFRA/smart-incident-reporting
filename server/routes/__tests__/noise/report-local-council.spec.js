import constants from '../../../utils/constants.js'

describe('noise/report-local-council', () => {
  it('Should call createReportLocalCouncilRoutes with correct config', () => {
    const createReportLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/report-local-council.js', () => ({
        __esModule: true,
        default: createReportLocalCouncilRoutes
      }))
      require('../../noise/report-local-council.js')
    })
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_REPORT_LOCAL_COUNCIL
    })
  })
})
