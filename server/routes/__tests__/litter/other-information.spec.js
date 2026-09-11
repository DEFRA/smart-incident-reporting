import constants from '../../../utils/constants.js'

describe('litter/other-information', () => {
  it('Should call createOtherInformationRoutes with correct config', () => {
    const createOtherInformationRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/other-information.js', () => ({
        __esModule: true,
        default: createOtherInformationRoutes
      }))
      require('../../litter/other-information.js')
    })

    expect(createOtherInformationRoutes).toHaveBeenCalledTimes(1)
    expect(createOtherInformationRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_OTHER_INFORMATION,
      redirect: {
        reportSent: constants.routes.LITTER_REPORT_SENT
      }
    })
  })
})
