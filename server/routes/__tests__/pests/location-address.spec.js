import constants from '../../../utils/constants.js'

describe('pests/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../pests/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_LOCATION_ADDRESS,
      redirect: {
        recurring: constants.routes.PESTS_RECURRING
      }
    })
  })
})
