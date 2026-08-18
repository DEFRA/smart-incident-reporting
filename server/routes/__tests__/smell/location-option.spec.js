import constants from '../../../utils/constants.js'

describe('smell/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../smell/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_LOCATION_OPTION,
      redirect: {
        locationMap: constants.routes.SMELL_LOCATION_MAP,
        locationDescription: constants.routes.SMELL_LOCATION_DESCRIPTION
      }
    })
  })
})
