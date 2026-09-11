import constants from '../../../utils/constants.js'

describe('noise/report-sent', () => {
  it('Should call createReportSentRoutes with correct config', () => {
    const createReportSentRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/report-sent.js', () => ({
        __esModule: true,
        default: createReportSentRoutes
      }))
      require('../../noise/report-sent.js')
    })

    expect(createReportSentRoutes).toHaveBeenCalledTimes(1)
    expect(createReportSentRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_REPORT_SENT
    })
  })
})
