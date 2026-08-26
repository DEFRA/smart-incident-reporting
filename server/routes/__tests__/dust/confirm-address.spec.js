import constants from '../../../utils/constants.js'

describe('dust/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../dust/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CONFIRM_ADDRESS,
      redirect: {
        description: constants.routes.DUST_DESCRIPTION,
        chooseAddress: constants.routes.DUST_CHOOSE_ADDRESS,
        locationAddress: constants.routes.DUST_LOCATION_ADDRESS
      }
    })
  })
})
