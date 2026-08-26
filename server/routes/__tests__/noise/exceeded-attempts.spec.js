import constants from '../../../utils/constants.js'

describe('noise/exceeded-attempts', () => {
  it('Should call createExceededAttemptsRoutes with correct config', () => {
    const createExceededAttemptsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/exceeded-attempts.js', () => ({
        __esModule: true,
        default: createExceededAttemptsRoutes
      }))
      require('../../noise/exceeded-attempts.js')
    })
    expect(createExceededAttemptsRoutes).toHaveBeenCalledTimes(1)
    expect(createExceededAttemptsRoutes).toHaveBeenCalledWith({
      route: constants.routes.NOISE_EXCEEDED_ATTEMPTS,
      redirect: {
        locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
      }
    })
  })
})
