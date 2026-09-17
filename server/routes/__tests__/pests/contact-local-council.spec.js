import constants from '../../../utils/constants.js'

describe('pests/contact-local-council', () => {
  it('Should call createContactLocalCouncilRoutes with correct config', () => {
    const createContactLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-local-council.js', () => ({
        __esModule: true,
        default: createContactLocalCouncilRoutes
      }))
      require('../../pests/contact-local-council.js')
    })
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_CONTACT_LOCAL_COUNCIL
    })
  })
})
