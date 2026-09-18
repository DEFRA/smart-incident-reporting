import constants from '../../../utils/constants.js'

describe('litter/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../litter/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.LITTER_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
      }
    })
  })
})
