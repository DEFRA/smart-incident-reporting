import constants from '../../../utils/constants.js'

describe('vermin/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../vermin/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
