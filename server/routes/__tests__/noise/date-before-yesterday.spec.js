import constants from '../../../utils/constants.js'

describe('noise/date-before-yesterday', () => {
  it('Should call createDateBeforeYesterdayRoutes with correct config', () => {
    const createDateBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/date-before-yesterday.js', () => ({
        __esModule: true,
        default: createDateBeforeYesterdayRoutes
      }))
      require('../../noise/date-before-yesterday.js')
    })
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_DATE_BEFORE_YESTERDAY,
      redirect: {
        timeBeforeYesterday: constants.routes.NOISE_TIME_BEFORE_YESTERDAY
      }
    })
  })
})
