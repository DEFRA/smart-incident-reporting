import constants from '../../../utils/constants.js'

describe('vermin/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../vermin/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_CONFIRM_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.VERMIN_CHOOSE_ADDRESS,
        locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS,
        recurring: constants.routes.VERMIN_RECURRING
      }
    })
  })
})
