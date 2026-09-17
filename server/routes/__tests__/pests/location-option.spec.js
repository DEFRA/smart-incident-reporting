import constants from '../../../utils/constants.js'

describe('pests/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../pests/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_LOCATION_OPTION,
      redirect: {
        locationMap: constants.routes.PESTS_LOCATION_MAP,
        locationDescription: constants.routes.PESTS_LOCATION_DESCRIPTION
      }
    })
  })
})
