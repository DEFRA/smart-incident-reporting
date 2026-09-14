import constants from '../../../utils/constants.js'

describe('smell/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../smell/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_CONTACT_DETAILS,
      redirect: {
        otherInformation: constants.routes.SMELL_OTHER_INFORMATION
      }
    })
  })
})
