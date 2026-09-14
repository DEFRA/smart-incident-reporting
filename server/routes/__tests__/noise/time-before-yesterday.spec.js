import constants from '../../../utils/constants.js'

describe('noise/time-before-yesterday', () => {
  it('Should call createTimeBeforeYesterdayRoutes with correct config', () => {
    const createTimeBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/time-before-yesterday.js', () => ({
        __esModule: true,
        default: createTimeBeforeYesterdayRoutes
      }))
      require('../../noise/time-before-yesterday.js')
    })
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_TIME_BEFORE_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.NOISE_WHEN_WORSE
      }
    })
  })
})
