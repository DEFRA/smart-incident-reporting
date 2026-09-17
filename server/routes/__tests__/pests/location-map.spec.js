import constants from '../../../utils/constants.js'

describe('pests/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../pests/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_LOCATION_MAP,
      redirect: {
        locationDescriptionOptional: constants.routes.PESTS_LOCATION_DESCRIPTION_OPTIONAL
      }
    })
  })
})
