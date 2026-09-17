import constants from '../../../utils/constants.js'

describe('pests/find-address', () => {
  it('Should call createFindAddressRoutes with correct config', () => {
    const createFindAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/find-address.js', () => ({
        __esModule: true,
        default: createFindAddressRoutes
      }))
      require('../../pests/find-address.js')
    })
    expect(createFindAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createFindAddressRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_FIND_ADDRESS,
      redirect: {
        chooseAddress: constants.routes.PESTS_CHOOSE_ADDRESS,
        exceededAttempts: constants.routes.PESTS_EXCEEDED_ATTEMPTS,
        locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
      }
    })
  })
})
