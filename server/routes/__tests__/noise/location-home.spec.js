import constants from '../../../utils/constants.js'

describe('noise/location-home', () => {
  it('Should call createLocationHomeRoutes with correct config', () => {
    const createLocationHomeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-home.js', () => ({
        __esModule: true,
        default: createLocationHomeRoutes
      }))
      require('../../noise/location-home.js')
    })
    expect(createLocationHomeRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationHomeRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_LOCATION_HOME,
      redirect: {
        findAddress: constants.routes.NOISE_FIND_ADDRESS,
        locationOption: constants.routes.NOISE_LOCATION_OPTION
      }
    })
  })
})
