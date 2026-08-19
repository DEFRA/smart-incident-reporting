import constants from '../../../utils/constants.js'

describe('noise/location-description-optional', () => {
  it('Should call createLocationDescriptionOptionalRoutes with correct config', () => {
    const createLocationDescriptionOptionalRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description-optional.js', () => ({
        __esModule: true,
        default: createLocationDescriptionOptionalRoutes
      }))
      require('../../noise/location-description-optional.js')
    })
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL
    })
  })
})
