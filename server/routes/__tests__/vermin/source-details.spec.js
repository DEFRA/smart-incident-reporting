import constants from '../../../utils/constants.js'

describe('vermin/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../vermin/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.VERMIN_LOCATION_HOME,
        contactLocalCouncil: constants.routes.VERMIN_CONTACT_LOCAL_COUNCIL
      }
    })
  })
})
