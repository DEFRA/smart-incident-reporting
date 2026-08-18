import constants from '../../../utils/constants.js'

describe('litter/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../litter/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_LOCATION_MAP,
      redirect: {
        locationDescriptionOptional: constants.routes.LITTER_LOCATION_DESCRIPTION_OPTIONAL
      }
    })
  })
})
