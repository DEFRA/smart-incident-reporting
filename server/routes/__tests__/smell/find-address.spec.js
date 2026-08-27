import constants from '../../../utils/constants.js'

describe('smell/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../smell/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      route: constants.routes.SMELL_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.SMELL_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
      }
    })
  })
})
