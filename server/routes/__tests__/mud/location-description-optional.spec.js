import constants from '../../../utils/constants.js'

describe('mud/location-description-optional', () => {
  it('Should call createLocationDescriptionOptionalRoutes with correct config', () => {
    const createLocationDescriptionOptionalRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description-optional.js', () => ({
        __esModule: true,
        default: createLocationDescriptionOptionalRoutes
      }))
      require('../../mud/location-description-optional.js')
    })
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionOptionalRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL,
      redirect: {
        description: constants.routes.MUD_DESCRIPTION
      }
    })
  })
})
