import constants from '../../../utils/constants.js'

describe('pests/exceeded-attempts', () => {
  it('Should call createExceededAttemptsRoutes with correct config', () => {
    const createExceededAttemptsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/exceeded-attempts.js', () => ({
        __esModule: true,
        default: createExceededAttemptsRoutes
      }))
      require('../../pests/exceeded-attempts.js')
    })
    expect(createExceededAttemptsRoutes).toHaveBeenCalledTimes(1)
    expect(createExceededAttemptsRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_EXCEEDED_ATTEMPTS,
      redirect: {
        locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
      }
    })
  })
})
