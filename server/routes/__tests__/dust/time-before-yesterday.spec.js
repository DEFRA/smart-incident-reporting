import constants from '../../../utils/constants.js'

describe('dust/time-before-yesterday', () => {
  it('Should call createTimeBeforeYesterdayRoutes with correct config', () => {
    const createTimeBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/time-before-yesterday.js', () => ({
        __esModule: true,
        default: createTimeBeforeYesterdayRoutes
      }))
      require('../../dust/time-before-yesterday.js')
    })
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_TIME_BEFORE_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.DUST_WHEN_WORSE
      }
    })
  })
})
