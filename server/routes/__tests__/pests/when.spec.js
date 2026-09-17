import constants from '../../../utils/constants.js'

describe('pests/when', () => {
  it('Should call createWhenRoutes with correct config', () => {
    const createWhenRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when.js', () => ({
        __esModule: true,
        default: createWhenRoutes
      }))
      require('../../pests/when.js')
    })
    expect(createWhenRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_WHEN,
      redirect: {
        effectOnDailyLife: constants.routes.PESTS_EFFECT_ON_DAILY_LIFE,
        earlierToday: constants.routes.PESTS_EARLIER_TODAY,
        yesterday: constants.routes.PESTS_YESTERDAY,
        dateBeforeYesterday: constants.routes.PESTS_DATE_BEFORE_YESTERDAY
      }
    })
  })
})
