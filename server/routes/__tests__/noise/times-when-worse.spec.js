import constants from '../../../utils/constants.js'

describe('noise/times-when-worse', () => {
  it('Should call createTimesWhenWorseRoutes with correct config', () => {
    const createTimesWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/times-when-worse.js', () => ({
        __esModule: true,
        default: createTimesWhenWorseRoutes
      }))
      require('../../noise/times-when-worse.js')
    })
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_TIMES_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
