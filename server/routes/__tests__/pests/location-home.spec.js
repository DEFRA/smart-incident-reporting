import constants from '../../../utils/constants.js'

describe('pests/location-home', () => {
  it('Should call createLocationHomeRoutes with correct config', () => {
    const createLocationHomeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-home.js', () => ({
        __esModule: true,
        default: createLocationHomeRoutes
      }))
      require('../../pests/location-home.js')
    })
    expect(createLocationHomeRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationHomeRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_LOCATION_HOME,
      redirect: {
        findAddress: constants.routes.PESTS_FIND_ADDRESS,
        locationOption: constants.routes.PESTS_LOCATION_OPTION
      }
    })
  })
})
