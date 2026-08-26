import constants from '../../../utils/constants.js'

describe('mud/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../mud/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      route: constants.routes.MUD_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.MUD_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.MUD_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.MUD_LOCATION_ADDRESS
      }
    })
  })
})
