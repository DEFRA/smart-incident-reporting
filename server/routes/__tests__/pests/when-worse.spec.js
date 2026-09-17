import constants from '../../../utils/constants.js'

describe('pests/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../pests/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE
      }
    })
  })
})
