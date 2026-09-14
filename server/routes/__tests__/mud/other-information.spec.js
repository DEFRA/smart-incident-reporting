import constants from '../../../utils/constants.js'

describe('mud/other-information', () => {
  it('Should call createOtherInformationRoutes with correct config', () => {
    const createOtherInformationRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/other-information.js', () => ({
        __esModule: true,
        default: createOtherInformationRoutes
      }))
      require('../../mud/other-information.js')
    })

    expect(createOtherInformationRoutes).toHaveBeenCalledTimes(1)
    expect(createOtherInformationRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_OTHER_INFORMATION,
      redirect: {
        reportSent: constants.routes.MUD_REPORT_SENT
      }
    })
  })
})
