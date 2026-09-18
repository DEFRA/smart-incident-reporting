import constants from '../../../utils/constants.js'

describe('smell/date-before-yesterday', () => {
  it('Should call createDateBeforeYesterdayRoutes with correct config', () => {
    const createDateBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/date-before-yesterday.js', () => ({
        __esModule: true,
        default: createDateBeforeYesterdayRoutes
      }))
      require('../../smell/date-before-yesterday.js')
    })
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_DATE_BEFORE_YESTERDAY,
      redirect: {
        timeBeforeYesterday: constants.routes.SMELL_TIME_BEFORE_YESTERDAY
      }
    })
  })
})
