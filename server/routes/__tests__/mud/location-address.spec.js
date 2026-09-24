import constants from '../../../utils/constants.js'

describe('mud/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../mud/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_ADDRESS,
      redirect: {
        description: constants.routes.MUD_DESCRIPTION
      }
    })
  })
})
