import constants from '../../../utils/constants.js'

describe('vermin/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../vermin/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.VERMIN_CONFIRM_ADDRESS,
        findAddress: constants.routes.VERMIN_FIND_ADDRESS,
        locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
      }
    })
  })
})
