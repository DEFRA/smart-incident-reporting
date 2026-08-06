import constants from '../../../utils/constants.js'

describe('dust/contact-environment-agency', () => {
  it('Should call createContactEnvironmentAgencyRoutes with correct config', () => {
    const createContactEnvironmentAgencyRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-environment-agency.js', () => ({
        __esModule: true,
        default: createContactEnvironmentAgencyRoutes
      }))
      require('../../dust/contact-environment-agency.js')
    })
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledTimes(1)
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY
    })
  })
})
