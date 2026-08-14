import constants from '../../../utils/constants.js'

describe('vermin/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../vermin/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_LOCATION_OPTION
    })
  })
})
