import constants from '../../../utils/constants.js'

describe('mud/contact-local-council', () => {
  it('Should call createContactLocalCouncilRoutes with correct config', () => {
    const createContactLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-local-council.js', () => ({
        __esModule: true,
        default: createContactLocalCouncilRoutes
      }))
      require('../../mud/contact-local-council.js')
    })
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CONTACT_LOCAL_COUNCIL
    })
  })
})
