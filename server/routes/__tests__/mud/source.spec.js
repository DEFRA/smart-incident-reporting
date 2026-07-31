import constants from '../../../utils/constants.js'

describe('mud/source', () => {
  it('Should call createSourceRoutes with correct config', () => {
    const mockCreateSourceRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source.js', () => ({
        __esModule: true,
        default: mockCreateSourceRoutes
      }))
      require('../../mud/source.js')
    })
    expect(mockCreateSourceRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateSourceRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_SOURCE,
      redirect: {
        contactEnvironmentAgency: constants.routes.MUD_CONTACT_ENVIRONMENT_AGENCY,
        localCouncil: constants.routes.MUD_REPORT_LOCAL_COUNCIL,
        sourceDetails: constants.routes.MUD_SOURCE_DETAILS
      }
    })
  })
})
