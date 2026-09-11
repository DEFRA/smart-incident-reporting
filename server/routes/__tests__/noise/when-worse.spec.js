import constants from '../../../utils/constants.js'

describe('noise/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../noise/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_WHEN_WORSE,
      redirect: {
        daysWhenWorse: constants.routes.NOISE_DAYS_WHEN_WORSE,
        effectOnDailyLife: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
