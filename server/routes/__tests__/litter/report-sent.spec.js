import constants from '../../../utils/constants.js'

describe('litter/report-sent', () => {
  it('Should call createReportSentRoutes with correct config', () => {
    const createReportSentRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/report-sent.js', () => ({
        __esModule: true,
        default: createReportSentRoutes
      }))
      require('../../litter/report-sent.js')
    })

    expect(createReportSentRoutes).toHaveBeenCalledTimes(1)
    expect(createReportSentRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_REPORT_SENT
    })
  })
})
