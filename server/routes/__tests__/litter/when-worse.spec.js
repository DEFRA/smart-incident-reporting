import constants from '../../../utils/constants.js'

describe('litter/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../litter/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_WHEN_WORSE,
      redirect: {
        daysWhenWorse: constants.routes.LITTER_DAYS_WHEN_WORSE,
        effectOnDailyLife: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
