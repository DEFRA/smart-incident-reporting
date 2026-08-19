import constants from '../../../utils/constants.js'

describe('dust/location-description-optional', () => {
  it('Should call createLocationDescriptionOptionalRoutes with correct config', () => {
    const createLocationDescriptionOptionalRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description-optional.js', () => ({
        __esModule: true,
        default: createLocationDescriptionOptionalRoutes
      }))
      require('../../dust/location-description-optional.js')
    })
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL
    })
  })
})
