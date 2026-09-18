import constants from '../../../utils/constants.js'

describe('noise/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../noise/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CONFIRM_ADDRESS,
      redirect: {
        description: constants.routes.NOISE_DESCRIPTION,
        chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
        locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
      }
    })
  })
})
