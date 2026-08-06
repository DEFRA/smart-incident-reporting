import constants from '../../../utils/constants.js'

describe('vermin/contact-environment-agency', () => {
  it('Should call createContactEnvironmentAgencyRoutes with correct config', () => {
    const createContactEnvironmentAgencyRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-environment-agency.js', () => ({
        __esModule: true,
        default: createContactEnvironmentAgencyRoutes
      }))
      require('../../vermin/contact-environment-agency.js')
    })
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledTimes(1)
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_CONTACT_ENVIRONMENT_AGENCY
    })
  })
})
