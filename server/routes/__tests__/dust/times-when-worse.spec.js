import constants from '../../../utils/constants.js'

describe('dust/times-when-worse', () => {
  it('Should call createTimesWhenWorseRoutes with correct config', () => {
    const createTimesWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/times-when-worse.js', () => ({
        __esModule: true,
        default: createTimesWhenWorseRoutes
      }))
      require('../../dust/times-when-worse.js')
    })
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_TIMES_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.DUST_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
