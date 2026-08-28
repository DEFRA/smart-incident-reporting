import constants from '../../../utils/constants.js'

describe('mud/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../mud/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CONFIRM_ADDRESS,
      redirect: {
        description: constants.routes.MUD_DESCRIPTION,
        chooseAddress: constants.routes.MUD_CHOOSE_ADDRESS,
        locationAddress: constants.routes.MUD_LOCATION_ADDRESS
      }
    })
  })
})
