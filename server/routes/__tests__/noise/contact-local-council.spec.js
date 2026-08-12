import constants from '../../../utils/constants.js'

describe('noise/contact-local-council', () => {
  it('Should call createContactLocalCouncilRoutes with correct config', () => {
    const createContactLocalCouncilRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-local-council.js', () => ({
        __esModule: true,
        default: createContactLocalCouncilRoutes
      }))
      require('../../noise/contact-local-council.js')
    })
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledTimes(1)
    expect(createContactLocalCouncilRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CONTACT_LOCAL_COUNCIL
    })
  })
})
