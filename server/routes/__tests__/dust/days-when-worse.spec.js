import constants from '../../../utils/constants.js'

describe('dust/days-when-worse', () => {
  it('Should call createDaysWhenWorseRoutes with correct config', () => {
    const createDaysWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/days-when-worse.js', () => ({
        __esModule: true,
        default: createDaysWhenWorseRoutes
      }))
      require('../../dust/days-when-worse.js')
    })
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_DAYS_WHEN_WORSE,
      redirect: {
        timesWhenWorse: constants.routes.DUST_TIMES_WHEN_WORSE
      }
    })
  })
})
