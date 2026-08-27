import constants from '../../../utils/constants.js'

describe('dust/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../dust/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.DUST_CONFIRM_ADDRESS,
        findAddress: constants.routes.DUST_FIND_ADDRESS,
        locationAddress: constants.routes.DUST_LOCATION_ADDRESS
      }
    })
  })
})
