import constants from '../../../utils/constants.js'

describe('mud/location-home', () => {
  it('Should call createLocationHomeRoutes with correct config', () => {
    const createLocationHomeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-home.js', () => ({
        __esModule: true,
        default: createLocationHomeRoutes
      }))
      require('../../mud/location-home.js')
    })
    expect(createLocationHomeRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationHomeRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_HOME,
      redirect: {
        findAddress: constants.routes.MUD_FIND_ADDRESS,
        locationOption: constants.routes.MUD_LOCATION_OPTION
      }
    })
  })
})
