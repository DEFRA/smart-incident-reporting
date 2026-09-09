import constants from '../../../utils/constants.js'

describe('smell/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../smell/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_YESTERDAY,
      redirect: {
        smellStrength: constants.routes.SMELL_SMELL_STRENGTH
      }
    })
  })
})
