import constants from '../../../utils/constants.js'

describe('smell/other-information', () => {
  it('Should call createOtherInformationRoutes with correct config', () => {
    const createOtherInformationRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/other-information.js', () => ({
        __esModule: true,
        default: createOtherInformationRoutes
      }))
      require('../../smell/other-information.js')
    })

    expect(createOtherInformationRoutes).toHaveBeenCalledTimes(1)
    expect(createOtherInformationRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_OTHER_INFORMATION
    })
  })
})
