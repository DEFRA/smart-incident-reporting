import constants from '../../../utils/constants.js'

describe('dust/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const mockCreateEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnDailyLifeRoutes
      }))
      require('../../dust/effect-on-daily-life.js')
    })
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_EFFECT_ON_DAILY_LIFE,
      redirect: {
        effectOnHealth: constants.routes.DUST_EFFECT_ON_HEALTH
      }
    })
  })
})
