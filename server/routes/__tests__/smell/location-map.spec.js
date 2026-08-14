import constants from '../../../utils/constants.js'

describe('smell/location-map', () => {
  it('Should call createLocationMapRoutes with correct config', () => {
    const createLocationMapRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-map.js', () => ({
        __esModule: true,
        default: createLocationMapRoutes
      }))
      require('../../smell/location-map.js')
    })
    expect(createLocationMapRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationMapRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_LOCATION_MAP
    })
  })
})
