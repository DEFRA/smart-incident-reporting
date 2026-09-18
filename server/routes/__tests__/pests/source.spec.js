import constants from '../../../utils/constants.js'

describe('pests/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const createSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: createSourceRoutes
      }))
      require('../../pests/source.js')
    })
    expect(createSourceRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.PESTS_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.PESTS_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.PESTS_SOURCE_DETAILS
      }
    })
  })
})
