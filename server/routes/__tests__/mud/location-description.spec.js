import constants from '../../../utils/constants.js'

describe('mud/location-description', () => {
  it('Should call createLocationDescriptionRoutes with correct config', () => {
    const createLocationDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description.js', () => ({
        __esModule: true,
        default: createLocationDescriptionRoutes
      }))
      require('../../mud/location-description.js')
    })
    expect(createLocationDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_DESCRIPTION,
      redirect: {
        description: constants.routes.MUD_DESCRIPTION
      }
    })
  })
})
