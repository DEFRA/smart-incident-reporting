import constants from '../../../utils/constants.js'

describe('pests/location-description-optional', () => {
  it('Should call createLocationDescriptionOptionalRoutes with correct config', () => {
    const createLocationDescriptionOptionalRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description-optional.js', () => ({
        __esModule: true,
        default: createLocationDescriptionOptionalRoutes
      }))
      require('../../pests/location-description-optional.js')
    })
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_LOCATION_DESCRIPTION_OPTIONAL,
      redirect: {
        recurring: constants.routes.PESTS_RECURRING
      }
    })
  })
})
