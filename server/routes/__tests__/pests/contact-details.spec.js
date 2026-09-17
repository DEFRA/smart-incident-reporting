import constants from '../../../utils/constants.js'

describe('pests/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../pests/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_CONTACT_DETAILS,
      redirect: {
        otherInformation: constants.routes.PESTS_OTHER_INFORMATION
      }
    })
  })
})
