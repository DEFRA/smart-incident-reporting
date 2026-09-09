import constants from '../../../utils/constants.js'

describe('litter/date-before-yesterday', () => {
  it('Should call createDateBeforeYesterdayRoutes with correct config', () => {
    const createDateBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/date-before-yesterday.js', () => ({
        __esModule: true,
        default: createDateBeforeYesterdayRoutes
      }))
      require('../../litter/date-before-yesterday.js')
    })
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_DATE_BEFORE_YESTERDAY,
      redirect: {
        timeBeforeYesterday: constants.routes.LITTER_TIME_BEFORE_YESTERDAY
      }
    })
  })
})
