import constants from '../../../utils/constants.js'

describe('litter/location-home', () => {
  it('Should call createLocationHomeRoutes with correct config', () => {
    const createLocationHomeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-home.js', () => ({
        __esModule: true,
        default: createLocationHomeRoutes
      }))
      require('../../litter/location-home.js')
    })
    expect(createLocationHomeRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationHomeRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_LOCATION_HOME,
      redirect: {
        findAddress: constants.routes.LITTER_FIND_ADDRESS,
        locationOption: constants.routes.LITTER_LOCATION_OPTION
      }
    })
  })
})
