import constants from '../../../utils/constants.js'

describe('dust/report-local-council', () => {
  it('Should call createReportLocalCouncilRoutes with correct config', () => {
    const createReportLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/report-local-council.js', () => ({
        __esModule: true,
        default: createReportLocalCouncilRoutes
      }))
      require('../../dust/report-local-council.js')
    })
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createReportLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_REPORT_LOCAL_COUNCIL
    })
  })
})
