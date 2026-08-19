import constants from '../../../utils/constants.js'

describe('mud/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../mud/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_MAP,
      redirect: {
        locationDescriptionOptional: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL
      }
    })
  })
})
