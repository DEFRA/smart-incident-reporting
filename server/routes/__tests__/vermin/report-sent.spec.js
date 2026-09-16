import constants from '../../../utils/constants.js'

describe('vermin/report-sent', () => {
  it('Should call createReportSentRoutes with correct config', () => {
    const createReportSentRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/report-sent.js', () => ({
        __esModule: true,
        default: createReportSentRoutes
      }))
      require('../../vermin/report-sent.js')
    })

    expect(createReportSentRoutes).toHaveBeenCalledTimes(1)
    expect(createReportSentRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_REPORT_SENT
    })
  })
})
