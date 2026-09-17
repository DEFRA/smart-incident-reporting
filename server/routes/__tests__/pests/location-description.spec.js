import constants from '../../../utils/constants.js'

describe('pests/location-description', () => {
  it('Should call createLocationDescriptionRoutes with correct config', () => {
    const createLocationDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/location-description.js', () => ({
        __esModule: true,
        default: createLocationDescriptionRoutes
      }))
      require('../../pests/location-description.js')
    })
    expect(createLocationDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createLocationDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_LOCATION_DESCRIPTION,
      redirect: {
        recurring: constants.routes.PESTS_RECURRING
      }
    })
  })
})
