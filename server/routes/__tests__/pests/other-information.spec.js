import constants from '../../../utils/constants.js'

describe('pests/other-information', () => {
  it('Should call createOtherInformationRoutes with correct config', () => {
    const createOtherInformationRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/other-information.js', () => ({
        __esModule: true,
        default: createOtherInformationRoutes
      }))
      require('../../pests/other-information.js')
    })

    expect(createOtherInformationRoutes).toHaveBeenCalledTimes(1)
    expect(createOtherInformationRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_OTHER_INFORMATION,
      redirect: {
        reportSent: constants.routes.PESTS_REPORT_SENT
      }
    })
  })
})
