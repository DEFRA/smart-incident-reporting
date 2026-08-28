import constants from '../../../utils/constants.js'

describe('litter/exceeded-attempts', () => {
  it('Should call createExceededAttemptsRoutes with correct config', () => {
    const createExceededAttemptsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/exceeded-attempts.js', () => ({
        __esModule: true,
        default: createExceededAttemptsRoutes
      }))
      require('../../litter/exceeded-attempts.js')
    })
    expect(createExceededAttemptsRoutes).toHaveBeenCalledTimes(1)
    expect(createExceededAttemptsRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_EXCEEDED_ATTEMPTS,
      redirect: {
        locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
      }
    })
  })
})
