import constants from '../../../utils/constants.js'

describe('vermin/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../vermin/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      route: constants.routes.VERMIN_LOCATION_ADDRESS,
      redirect: {
        description: constants.routes.VERMIN_DESCRIPTION
      }
    })
  })
})
