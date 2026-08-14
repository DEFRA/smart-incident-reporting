import constants from '../../../utils/constants.js'

describe('vermin/contact-local-council', () => {
  it('Should call createContactLocalCouncilRoutes with correct config', () => {
    const createContactLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-local-council.js', () => ({
        __esModule: true,
        default: createContactLocalCouncilRoutes
      }))
      require('../../vermin/contact-local-council.js')
    })
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_CONTACT_LOCAL_COUNCIL
    })
  })
})
