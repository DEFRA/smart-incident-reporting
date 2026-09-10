import constants from '../../../utils/constants.js'

describe('dust/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../dust/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CONTACT_DETAILS,
      redirect: {
        otherInformation: constants.routes.DUST_OTHER_INFORMATION
      }
    })
  })
})
