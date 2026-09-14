import constants from '../../../utils/constants.js'

describe('vermin/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../vermin/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_EARLIER_TODAY,
      redirect: {
        effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
