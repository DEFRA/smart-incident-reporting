import constants from '../../../utils/constants.js'

describe('noise/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../noise/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_LOCATION_MAP,
      redirect: {
        locationDescriptionOptional: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL
      }
    })
  })
})
