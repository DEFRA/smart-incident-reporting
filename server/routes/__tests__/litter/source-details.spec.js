import constants from '../../../utils/constants.js'

describe('litter/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../litter/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.LITTER_LOCATION_HOME,
        contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY
      }
    })
  })
})
