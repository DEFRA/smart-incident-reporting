import constants from '../../../utils/constants.js'

describe('mud/times-when-worse', () => {
  it('Should call createTimesWhenWorseRoutes with correct config', () => {
    const createTimesWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/times-when-worse.js', () => ({
        __esModule: true,
        default: createTimesWhenWorseRoutes
      }))
      require('../../mud/times-when-worse.js')
    })
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createTimesWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_TIMES_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.MUD_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
