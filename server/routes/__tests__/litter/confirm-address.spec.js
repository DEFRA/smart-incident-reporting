import constants from '../../../utils/constants.js'

describe('litter/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../litter/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      route: constants.routes.LITTER_CONFIRM_ADDRESS,
      redirect: {
        description: constants.routes.LITTER_DESCRIPTION,
        chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
        locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
      }
    })
  })
})
