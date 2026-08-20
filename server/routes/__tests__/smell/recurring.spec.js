import constants from '../../../utils/constants.js'

describe('smell/recurring', () => {
  it('Should call createRecurringRoutes with correct config', () => {
    const createRecurringRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/recurring.js', () => ({
        __esModule: true,
        default: createRecurringRoutes
      }))
      require('../../smell/recurring.js')
    })
    expect(createRecurringRoutes).toHaveBeenCalledTimes(1)
    expect(createRecurringRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_RECURRING
    })
  })
})
