import constants from '../../../utils/constants.js'

describe('mud/days-when-worse', () => {
  it('Should call createDaysWhenWorseRoutes with correct config', () => {
    const createDaysWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/days-when-worse.js', () => ({
        __esModule: true,
        default: createDaysWhenWorseRoutes
      }))
      require('../../mud/days-when-worse.js')
    })
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createDaysWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_DAYS_WHEN_WORSE,
      redirect: {
        timesWhenWorse: constants.routes.MUD_TIMES_WHEN_WORSE
      }
    })
  })
})
