import constants from '../../../utils/constants.js'

describe('vermin/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../vermin/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_YESTERDAY,
      redirect: {
        effectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
