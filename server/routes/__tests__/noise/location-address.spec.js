import constants from '../../../utils/constants.js'

describe('noise/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../noise/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_LOCATION_ADDRESS,
      redirect: {
        description: constants.routes.NOISE_DESCRIPTION
      }
    })
  })
})
