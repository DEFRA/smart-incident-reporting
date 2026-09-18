import constants from '../../../utils/constants.js'

describe('noise/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../noise/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.NOISE_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
      }
    })
  })
})
