import constants from '../../../utils/constants.js'

describe('noise/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../noise/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.NOISE_CONFIRM_ADDRESS,
        findAddress: constants.routes.NOISE_FIND_ADDRESS,
        locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
      }
    })
  })
})
