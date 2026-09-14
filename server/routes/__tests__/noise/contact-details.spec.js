import constants from '../../../utils/constants.js'

describe('noise/contact-details', () => {
  it('Should call createContactDetailsRoutes with correct config', () => {
    const createContactDetailsRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/contact-details.js', () => ({
        __esModule: true,
        default: createContactDetailsRoutes
      }))
      require('../../noise/contact-details.js')
    })

    expect(createContactDetailsRoutes).toHaveBeenCalledTimes(1)
    expect(createContactDetailsRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CONTACT_DETAILS
    })
  })
})
