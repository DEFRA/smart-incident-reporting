import constants from '../../../utils/constants.js'

describe('pests/recurring', () => {
  it('Should call createRecurringRoutes with correct config', () => {
    const createRecurringRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/recurring.js', () => ({
        __esModule: true,
        default: createRecurringRoutes
      }))
      require('../../pests/recurring.js')
    })
    expect(createRecurringRoutes).toHaveBeenCalledTimes(1)
    expect(createRecurringRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_RECURRING,
      redirect: {
        when: constants.routes.PESTS_WHEN
      }
    })
  })
})
