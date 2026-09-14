import constants from '../../../utils/constants.js'

describe('litter/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const createSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: createSourceRoutes
      }))
      require('../../litter/source.js')
    })
    expect(createSourceRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceRoutes).toHaveBeenCalledWith({
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
