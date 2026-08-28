import constants from '../../../utils/constants.js'

describe('vermin/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../vermin/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.VERMIN_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.VERMIN_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
      }
    })
  })
})
