import constants from '../../../utils/constants.js'

describe('dust/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../dust/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.DUST_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.DUST_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.DUST_LOCATION_ADDRESS
      }
    })
  })
})
