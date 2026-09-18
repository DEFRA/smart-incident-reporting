import constants from '../../../utils/constants.js'

describe('litter/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../litter/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_LOCATION_OPTION,
      redirect: {
        locationMap: constants.routes.LITTER_LOCATION_MAP,
        locationDescription: constants.routes.LITTER_LOCATION_DESCRIPTION
      }
    })
  })
})
