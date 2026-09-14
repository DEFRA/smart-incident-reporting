import constants from '../../../utils/constants.js'

describe('smell/earlier-today', () => {
  it('Should call createEarlierTodayRoutes with correct config', () => {
    const createEarlierTodayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/earlier-today.js', () => ({
        __esModule: true,
        default: createEarlierTodayRoutes
      }))
      require('../../smell/earlier-today.js')
    })
    expect(createEarlierTodayRoutes).toHaveBeenCalledTimes(1)
    expect(createEarlierTodayRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_EARLIER_TODAY,
      redirect: {
        smellStrength: constants.routes.SMELL_SMELL_STRENGTH
      }
    })
  })
})
