import constants from '../../../utils/constants.js'

describe('dust/recurring', () => {
  it('Should call createRecurringRoutes with correct config', () => {
    const createRecurringRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/recurring.js', () => ({
        __esModule: true,
        default: createRecurringRoutes
      }))
      require('../../dust/recurring.js')
    })
    expect(createRecurringRoutes).toHaveBeenCalledTimes(1)
    expect(createRecurringRoutes).toHaveBeenCalledWith({
      problem: 'dust',
<<<<<<< HEAD
      route: constants.routes.DUST_RECURRING,
      redirect: {
        when: constants.routes.DUST_WHEN
      }
=======
      route: constants.routes.DUST_RECURRING
>>>>>>> report-a-regulated-site
    })
  })
})
