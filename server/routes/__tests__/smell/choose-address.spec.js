import constants from '../../../utils/constants.js'

describe('smell/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../smell/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.SMELL_CONFIRM_ADDRESS,
        findAddress: constants.routes.SMELL_FIND_ADDRESS,
        locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
      }
    })
  })
})
