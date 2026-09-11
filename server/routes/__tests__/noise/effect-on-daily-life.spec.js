import constants from '../../../utils/constants.js'

describe('noise/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const createEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: createEffectOnDailyLifeRoutes
      }))
      require('../../noise/effect-on-daily-life.js')
    })
    expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
    })
  })
})
