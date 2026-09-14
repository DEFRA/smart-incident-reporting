import constants from '../../../utils/constants.js'

describe('litter/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../litter/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CONTACT_DETAILS
    })
  })
})
