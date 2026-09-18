import constants from '../../../utils/constants.js'

describe('noise/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../noise/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.NOISE_LOCATION_HOME,
        contactEnvironmentAgency: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY
      }
    })
  })
})
