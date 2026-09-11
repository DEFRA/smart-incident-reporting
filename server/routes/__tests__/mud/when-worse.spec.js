import constants from '../../../utils/constants.js'

describe('mud/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../mud/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_WHEN_WORSE,
      redirect: {
        daysWhenWorse: constants.routes.MUD_DAYS_WHEN_WORSE,
        effectOnDailyLife: constants.routes.MUD_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
