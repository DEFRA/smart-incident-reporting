import constants from '../../../utils/constants.js'

describe('dust/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../dust/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.DUST_LOCATION_HOME,
        contactEnvironmentAgency: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY
      }
    })
  })
})
