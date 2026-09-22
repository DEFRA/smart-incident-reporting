import constants from '../../../utils/constants.js'

describe('noise/other-information', () => {
  it('Should call createOtherInformationRoutes with correct config', () => {
    const createOtherInformationRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/other-information.js', () => ({
        __esModule: true,
        default: createOtherInformationRoutes
      }))
      require('../../noise/other-information.js')
    })

    expect(createOtherInformationRoutes).toHaveBeenCalledTimes(1)
    expect(createOtherInformationRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_OTHER_INFORMATION
    })
  })
})
