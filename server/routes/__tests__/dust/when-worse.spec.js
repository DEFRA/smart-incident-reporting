import constants from '../../../utils/constants.js'

describe('dust/when-worse', () => {
  it('Should call createWhenWorseRoutes with correct config', () => {
    const createWhenWorseRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when-worse.js', () => ({
        __esModule: true,
        default: createWhenWorseRoutes
      }))
      require('../../dust/when-worse.js')
    })
    expect(createWhenWorseRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenWorseRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_WHEN_WORSE,
      redirect: {
        daysWhenWorse: constants.routes.DUST_DAYS_WHEN_WORSE
      }
    })
  })
})
