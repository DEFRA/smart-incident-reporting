import constants from '../../../utils/constants.js'

describe('mud/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../mud/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_LOCATION_OPTION,
      redirect: {
        locationMap: constants.routes.MUD_LOCATION_MAP,
        locationDescription: constants.routes.MUD_LOCATION_DESCRIPTION
      }
    })
  })
})
