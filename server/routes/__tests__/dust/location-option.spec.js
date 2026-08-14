import constants from '../../../utils/constants.js'

describe('dust/location-option', () => {
  it('Should call createLocationOptionRoutes with correct config', () => {
    const createLocationOptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-option.js', () => ({
        __esModule: true,
        default: createLocationOptionRoutes
      }))
      require('../../dust/location-option.js')
    })
    expect(createLocationOptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationOptionRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_LOCATION_OPTION
    })
  })
})
