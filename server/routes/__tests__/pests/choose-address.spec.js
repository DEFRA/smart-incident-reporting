import constants from '../../../utils/constants.js'

describe('pests/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../pests/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.PESTS_CONFIRM_ADDRESS,
        findAddress: constants.routes.PESTS_FIND_ADDRESS,
        locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
      }
    })
  })
})
