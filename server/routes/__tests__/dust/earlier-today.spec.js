import constants from '../../../utils/constants.js'

describe('dust/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../dust/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_EARLIER_TODAY,
      redirect: {
        whenWorse: constants.routes.DUST_WHEN_WORSE
      }
    })
  })
})
