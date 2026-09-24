import constants from '../../../utils/constants.js'

describe('pests/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../pests/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_EARLIER_TODAY,
      redirect: {
        effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
