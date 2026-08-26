import constants from '../../../utils/constants.js'

describe('litter/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../litter/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.LITTER_CONFIRM_ADDRESS,
        findAddress: constants.routes.LITTER_FIND_ADDRESS,
        locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
      }
    })
  })
})
