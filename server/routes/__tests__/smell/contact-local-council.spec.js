import constants from '../../../utils/constants.js'

describe('smell/contact-local-council', () => {
  it('Should call createContactLocalCouncilRoutes with correct config', () => {
    const createContactLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-local-council.js', () => ({
        __esModule: true,
        default: createContactLocalCouncilRoutes
      }))
      require('../../smell/contact-local-council.js')
    })
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_CONTACT_LOCAL_COUNCIL
    })
  })
})
