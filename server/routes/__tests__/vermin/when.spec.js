import constants from '../../../utils/constants.js'

describe('vermin/when', () => {
  it('Should call createWhenRoutes with correct config', () => {
    const createWhenRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when.js', () => ({
        __esModule: true,
        default: createWhenRoutes
      }))
      require('../../vermin/when.js')
    })
    expect(createWhenRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_WHEN,
      redirect: {
        effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
        earlierToday: constants.routes.VERMIN_EARLIER_TODAY,
        yesterday: constants.routes.VERMIN_YESTERDAY,
        dateBeforeYesterday: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY
      }
    })
  })
})
