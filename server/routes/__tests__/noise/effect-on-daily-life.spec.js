import constants from '../../../utils/constants.js'

describe('noise/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const mockCreateEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnDailyLifeRoutes
      }))
      require('../../noise/effect-on-daily-life.js')
    })
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE,
      redirect: {
        effectOnHealth: constants.routes.NOISE_EFFECT_ON_HEALTH
      }
    })
  })
})
