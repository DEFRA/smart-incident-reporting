import constants from '../../../utils/constants.js'

describe('vermin/location-home', () => {
  it('Should call createLocationHomeRoutes with correct config', () => {
    const createLocationHomeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-home.js', () => ({
        __esModule: true,
        default: createLocationHomeRoutes
      }))
      require('../../vermin/location-home.js')
    })
    expect(createLocationHomeRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationHomeRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_LOCATION_HOME,
      redirect: {
        findAddress: constants.routes.VERMIN_FIND_ADDRESS,
        locationOption: constants.routes.VERMIN_LOCATION_OPTION
      }
    })
  })
})
