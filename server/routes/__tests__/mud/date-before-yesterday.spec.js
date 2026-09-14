import constants from '../../../utils/constants.js'

describe('mud/date-before-yesterday', () => {
  it('Should call createDateBeforeYesterdayRoutes with correct config', () => {
    const createDateBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/date-before-yesterday.js', () => ({
        __esModule: true,
        default: createDateBeforeYesterdayRoutes
      }))
      require('../../mud/date-before-yesterday.js')
    })
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createDateBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_DATE_BEFORE_YESTERDAY,
      redirect: {
        timeBeforeYesterday: constants.routes.MUD_TIME_BEFORE_YESTERDAY
      }
    })
  })
})
