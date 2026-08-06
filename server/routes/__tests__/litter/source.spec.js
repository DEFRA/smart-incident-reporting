import constants from '../../../utils/constants.js'

describe('litter/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const mockCreateSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: mockCreateSourceRoutes
      }))
      require('../../litter/source.js')
    })
    expect(mockCreateSourceRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateSourceRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.LITTER_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.LITTER_SOURCE_DETAILS
      }
    })
  })
})
