import constants from '../../../utils/constants.js'

describe('noise/recurring', () => {
  it('Should call createRecurringRoutes with correct config', () => {
    const createRecurringRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/recurring.js', () => ({
        __esModule: true,
        default: createRecurringRoutes
      }))
      require('../../noise/recurring.js')
    })
    expect(createRecurringRoutes).toHaveBeenCalledTimes(1)
    expect(createRecurringRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_RECURRING,
      redirect: {
        when: constants.routes.NOISE_WHEN
      }
    })
  })
})
