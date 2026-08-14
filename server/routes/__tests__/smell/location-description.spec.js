import constants from '../../../utils/constants.js'

describe('smell/location-description', () => {
  it('Should call createLocationDescriptionRoutes with correct config', () => {
    const createLocationDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description.js', () => ({
        __esModule: true,
        default: createLocationDescriptionRoutes
      }))
      require('../../smell/location-description.js')
    })
    expect(createLocationDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_LOCATION_DESCRIPTION
    })
  })
})
