import constants from '../../../utils/constants.js'

describe('litter/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const mockCreateEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnDailyLifeRoutes
      }))
      require('../../litter/effect-on-daily-life.js')
    })
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE,
      redirect: {
        effectOnHealth: constants.routes.LITTER_EFFECT_ON_HEALTH
      }
    })
  })
})
