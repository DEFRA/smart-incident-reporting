import constants from '../../../utils/constants.js'

describe('dust/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const createEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: createEffectOnDailyLifeRoutes
      }))
      require('../../dust/effect-on-daily-life.js')
    })
    expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_EFFECT_ON_DAILY_LIFE
    })
  })
})
