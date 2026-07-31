import constants from '../../../utils/constants.js'

describe('noise/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const mockCreateSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: mockCreateSourceRoutes
      }))
      require('../../noise/source.js')
    })
    expect(mockCreateSourceRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateSourceRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.NOISE_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.NOISE_SOURCE_DETAILS
      }
    })
  })
})
