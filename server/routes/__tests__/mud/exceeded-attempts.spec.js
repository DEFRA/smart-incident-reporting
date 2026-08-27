import constants from '../../../utils/constants.js'

describe('mud/exceeded-attempts', () => {
  it('Should call createExceededAttemptsRoutes with correct config', () => {
    const createExceededAttemptsRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/exceeded-attempts.js', () => ({
        __esModule: true,
        default: createExceededAttemptsRoutes
      }))
      require('../../mud/exceeded-attempts.js')
    })
    expect(createExceededAttemptsRoutes).toHaveBeenCalledTimes(1)
    expect(createExceededAttemptsRoutes).toHaveBeenCalledWith({
      route: constants.routes.MUD_EXCEEDED_ATTEMPTS,
      redirect: {
        locationAddress: constants.routes.MUD_LOCATION_ADDRESS
      }
    })
  })
})
