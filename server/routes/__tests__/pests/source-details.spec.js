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
      problem: 'vermin/pests',
      route: constants.routes.PESTS_SOURCE_DETAILS,
      redirect: {
        recurring: constants.routes.PESTS_RECURRING,
        contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY
      }
    })
  })
})
