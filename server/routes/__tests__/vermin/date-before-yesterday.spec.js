import constants from '../../../utils/constants.js'

describe('vermin/date-before-yesterday', () => {
  it('Should call createDateBeforeYesterdayRoutes with correct config', () => {
    const createDateBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/date-before-yesterday.js', () => ({
        __esModule: true,
        default: createDateBeforeYesterdayRoutes
      }))
      require('../../vermin/date-before-yesterday.js')
    })
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY,
      redirect: {
        timeBeforeYesterday: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY
      }
    })
  })
})
