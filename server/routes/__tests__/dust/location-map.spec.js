import constants from '../../../utils/constants.js'

describe('dust/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../dust/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_LOCATION_MAP,
      redirect: {
        locationDescriptionOptional: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL
      }
    })
  })
})
