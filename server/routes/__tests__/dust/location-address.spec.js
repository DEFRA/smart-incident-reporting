import constants from '../../../utils/constants.js'

describe('dust/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../dust/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_LOCATION_ADDRESS,
      redirect: {
        description: constants.routes.DUST_DESCRIPTION
      }
    })
  })
})
