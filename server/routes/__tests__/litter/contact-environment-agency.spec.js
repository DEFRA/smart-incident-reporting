import constants from '../../../utils/constants.js'

describe('litter/contact-environment-agency', () => {
  it('Should call createContactEnvironmentAgencyRoutes with correct config', () => {
    const createContactEnvironmentAgencyRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-environment-agency.js', () => ({
        __esModule: true,
        default: createContactEnvironmentAgencyRoutes
      }))
      require('../../litter/contact-environment-agency.js')
    })
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledTimes(1)
    expect(createContactEnvironmentAgencyRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY
    })
  })
})
