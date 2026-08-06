import constants from '../../../utils/constants.js'

describe('vermin/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const mockCreateSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: mockCreateSourceRoutes
      }))
      require('../../vermin/source.js')
    })
    expect(mockCreateSourceRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateSourceRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.VERMIN_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.VERMIN_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.VERMIN_SOURCE_DETAILS
      }
    })
  })
})
