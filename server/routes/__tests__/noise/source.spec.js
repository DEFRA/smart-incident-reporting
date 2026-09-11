import constants from '../../../utils/constants.js'

describe('noise/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const createSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: createSourceRoutes
      }))
      require('../../noise/source.js')
    })
    expect(createSourceRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceRoutes).toHaveBeenCalledWith({
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
