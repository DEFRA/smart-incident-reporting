import constants from '../../../utils/constants.js'

describe('mud/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../mud/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CONTACT_DETAILS
    })
  })
})
