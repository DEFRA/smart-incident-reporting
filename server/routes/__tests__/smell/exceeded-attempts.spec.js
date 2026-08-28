import constants from '../../../utils/constants.js'

describe('smell/exceeded-attempts', () => {
  it('Should call createExceededAttemptsRoutes with correct config', () => {
    const createExceededAttemptsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/exceeded-attempts.js', () => ({
        __esModule: true,
        default: createExceededAttemptsRoutes
      }))
      require('../../smell/exceeded-attempts.js')
    })
    expect(createExceededAttemptsRoutes).toHaveBeenCalledTimes(1)
    expect(createExceededAttemptsRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_EXCEEDED_ATTEMPTS,
      redirect: {
        locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
      }
    })
  })
})
