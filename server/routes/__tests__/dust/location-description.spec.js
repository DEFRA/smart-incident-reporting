import constants from '../../../utils/constants.js'

describe('dust/location-description', () => {
  it('Should call createLocationDescriptionRoutes with correct config', () => {
    const createLocationDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description.js', () => ({
        __esModule: true,
        default: createLocationDescriptionRoutes
      }))
      require('../../dust/location-description.js')
    })
    expect(createLocationDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_LOCATION_DESCRIPTION
    })
  })
})
