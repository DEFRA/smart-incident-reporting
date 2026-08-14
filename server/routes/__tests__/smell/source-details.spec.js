import constants from '../../../utils/constants.js'

describe('smell/source-details', () => {
  it('Should call createSourceDetailsRoutes with correct config', () => {
    const createSourceDetailsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/source-details.js', () => ({
        __esModule: true,
        default: createSourceDetailsRoutes
      }))
      require('../../smell/source-details.js')
    })
    expect(createSourceDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createSourceDetailsRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_SOURCE_DETAILS,
      redirect: {
        locationHome: constants.routes.SMELL_LOCATION_HOME,
        contactLocalCouncil: constants.routes.SMELL_CONTACT_LOCAL_COUNCIL
      }
    })
  })
})
