import constants from '../../../utils/constants.js'

describe('mud/time-before-yesterday', () => {
  it('Should call createTimeBeforeYesterdayRoutes with correct config', () => {
    const createTimeBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/time-before-yesterday.js', () => ({
        __esModule: true,
        default: createTimeBeforeYesterdayRoutes
      }))
      require('../../mud/time-before-yesterday.js')
    })
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_TIME_BEFORE_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.MUD_WHEN_WORSE
      }
    })
  })
})
