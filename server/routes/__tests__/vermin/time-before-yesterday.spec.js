import constants from '../../../utils/constants.js'

describe('vermin/time-before-yesterday', () => {
  it('Should call createTimeBeforeYesterdayRoutes with correct config', () => {
    const createTimeBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/time-before-yesterday.js', () => ({
        __esModule: true,
        default: createTimeBeforeYesterdayRoutes
      }))
      require('../../vermin/time-before-yesterday.js')
    })
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY,
      redirect: {
        effectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
