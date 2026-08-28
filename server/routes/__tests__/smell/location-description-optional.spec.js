import constants from '../../../utils/constants.js'

describe('smell/location-description-optional', () => {
  it('Should call createLocationDescriptionOptionalRoutes with correct config', () => {
    const createLocationDescriptionOptionalRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description-optional.js', () => ({
        __esModule: true,
        default: createLocationDescriptionOptionalRoutes
      }))
      require('../../smell/location-description-optional.js')
    })
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL,
      redirect: {
        recurring: constants.routes.SMELL_RECURRING
      }
    })
  })
})
