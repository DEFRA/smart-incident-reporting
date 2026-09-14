import constants from '../../../utils/constants.js'

describe('litter/days-when-worse', () => {
  it('Should call createDaysWhenWorseRoutes with correct config', () => {
    const createDaysWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/days-when-worse.js', () => ({
        __esModule: true,
        default: createDaysWhenWorseRoutes
      }))
      require('../../litter/days-when-worse.js')
    })
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_DAYS_WHEN_WORSE,
      redirect: {
        timesWhenWorse: constants.routes.LITTER_TIMES_WHEN_WORSE
      }
    })
  })
})
