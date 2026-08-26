import constants from '../../../utils/constants.js'

describe('smell/confirm-address', () => {
  it('Should call createConfirmAddressRoutes with correct config', () => {
    const createConfirmAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-address.js', () => ({
        __esModule: true,
        default: createConfirmAddressRoutes
      }))
      require('../../smell/confirm-address.js')
    })
    expect(createConfirmAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmAddressRoutes).toHaveBeenCalledWith({
      route: constants.routes.SMELL_CONFIRM_ADDRESS,
      redirect: {
        description: constants.routes.SMELL_DESCRIPTION,
        chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS,
        locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
      }
    })
  })
})
