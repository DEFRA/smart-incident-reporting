import constants from '../../../utils/constants.js'

describe('pests/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../pests/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_CONFIRM_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.PESTS_CHOOSE_ADDRESS,
        locationAddress: constants.routes.PESTS_LOCATION_ADDRESS,
        recurring: constants.routes.PESTS_RECURRING
      }
    })
  })
})
