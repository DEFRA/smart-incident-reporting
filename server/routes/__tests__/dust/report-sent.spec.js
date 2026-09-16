import constants from '../../../utils/constants.js'

describe('dust/report-sent', () => {
  it('Should call createReportSentRoutes with correct config', () => {
    const createReportSentRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/report-sent.js', () => ({
        __esModule: true,
        default: createReportSentRoutes
      }))
      require('../../dust/report-sent.js')
    })

    expect(createReportSentRoutes).toHaveBeenCalledTimes(1)
    expect(createReportSentRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_REPORT_SENT
    })
  })
})
