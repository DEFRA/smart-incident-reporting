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
      problem: 'litter',
      route: constants.routes.LITTER_CONFIRM_ADDRESS
    })
  })
})
