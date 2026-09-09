import constants from '../../../utils/constants.js'

describe('noise/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../noise/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_EARLIER_TODAY,
      redirect: {
        whenWorse: constants.routes.NOISE_WHEN_WORSE
      }
    })
  })
})
