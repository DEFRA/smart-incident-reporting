import constants from '../../../utils/constants.js'

describe('pests/effect-on-daily-life', () => {
  it('Should call createEffectOnDailyLifeRoutes with correct config', () => {
    const mockCreateEffectOnDailyLifeRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-daily-life.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnDailyLifeRoutes
      }))
      require('../../pests/effect-on-daily-life.js')
    })
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE,
      redirect: {
        effectOnHealth: constants.routes.PESTS_EFFECT_ON_HEALTH
      }
    })
  })
})
