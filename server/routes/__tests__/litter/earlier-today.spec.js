import constants from '../../../utils/constants.js'

describe('litter/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../litter/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_EARLIER_TODAY,
      redirect: {
        whenWorse: constants.routes.LITTER_WHEN_WORSE
      }
    })
  })
})
