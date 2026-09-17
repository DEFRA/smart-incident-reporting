import constants from '../../../utils/constants.js'

describe('pests/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../pests/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.PESTS_LOCATION_HOME,
        contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY
      }
    })
  })
})
