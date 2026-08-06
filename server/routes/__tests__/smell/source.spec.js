import constants from '../../../utils/constants.js'

describe('smell/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const mockCreateSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: mockCreateSourceRoutes
      }))
      require('../../smell/source.js')
    })
    expect(mockCreateSourceRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateSourceRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.SMELL_SOURCE_DETAILS
      }
    })
  })
})
