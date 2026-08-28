import constants from '../../../utils/constants.js'

describe('litter/recurring', () => {
  it('Should call createRecurringRoutes with correct config', () => {
    const createRecurringRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/recurring.js', () => ({
        __esModule: true,
        default: createRecurringRoutes
      }))
      require('../../litter/recurring.js')
    })
    expect(createRecurringRoutes).toHaveBeenCalledTimes(1)
    expect(createRecurringRoutes).toHaveBeenCalledWith({
      problem: 'litter',
<<<<<<< HEAD
      route: constants.routes.LITTER_RECURRING,
      redirect: {
        when: constants.routes.LITTER_WHEN
      }
=======
      route: constants.routes.LITTER_RECURRING
>>>>>>> report-a-regulated-site
    })
  })
})
