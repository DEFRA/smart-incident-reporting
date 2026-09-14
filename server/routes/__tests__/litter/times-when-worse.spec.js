import constants from '../../../utils/constants.js'

describe('litter/times-when-worse', () => {
  it('Should call createTimesWhenWorseRoutes with correct config', () => {
    const createTimesWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/times-when-worse.js', () => ({
        __esModule: true,
        default: createTimesWhenWorseRoutes
      }))
      require('../../litter/times-when-worse.js')
    })
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_TIMES_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
