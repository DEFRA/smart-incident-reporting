import constants from '../../../utils/constants.js'

describe('dust/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const createSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: createSourceRoutes
      }))
      require('../../dust/source.js')
    })
    expect(createSourceRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.DUST_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.DUST_SOURCE_DETAILS
      }
    })
  })
})
