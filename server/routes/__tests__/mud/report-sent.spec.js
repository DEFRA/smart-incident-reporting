import constants from '../../../utils/constants.js'

describe('mud/report-sent', () => {
  it('Should call createReportSentRoutes with correct config', () => {
    const createReportSentRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/report-sent.js', () => ({
        __esModule: true,
        default: createReportSentRoutes
      }))
      require('../../mud/report-sent.js')
    })

    expect(createReportSentRoutes).toHaveBeenCalledTimes(1)
    expect(createReportSentRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_REPORT_SENT
    })
  })
})
