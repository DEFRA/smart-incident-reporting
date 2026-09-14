import constants from '../../../utils/constants.js'

describe('noise/days-when-worse', () => {
  it('Should call createDaysWhenWorseRoutes with correct config', () => {
    const createDaysWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/days-when-worse.js', () => ({
        __esModule: true,
        default: createDaysWhenWorseRoutes
      }))
      require('../../noise/days-when-worse.js')
    })
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_DAYS_WHEN_WORSE,
      redirect: {
        timesWhenWorse: constants.routes.NOISE_TIMES_WHEN_WORSE
      }
    })
  })
})
