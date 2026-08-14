import constants from '../../../utils/constants.js'

describe('vermin/location-description', () => {
  it('Should call createLocationDescriptionRoutes with correct config', () => {
    const createLocationDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description.js', () => ({
        __esModule: true,
        default: createLocationDescriptionRoutes
      }))
      require('../../vermin/location-description.js')
    })
    expect(createLocationDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_LOCATION_DESCRIPTION
    })
  })
})
