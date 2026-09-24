import constants from '../../../utils/constants.js'

describe('smell/location-address', () => {
  it('Should call createLocationAddressRoutes with correct config', () => {
    const createLocationAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-address.js', () => ({
        __esModule: true,
        default: createLocationAddressRoutes
      }))
      require('../../smell/location-address.js')
    })
    expect(createLocationAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationAddressRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_LOCATION_ADDRESS,
      redirect: {
        description: constants.routes.SMELL_DESCRIPTION
      }
    })
  })
})
