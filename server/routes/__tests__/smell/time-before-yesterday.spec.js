import constants from '../../../utils/constants.js'

describe('smell/time-before-yesterday', () => {
  it('Should call createTimeBeforeYesterdayRoutes with correct config', () => {
    const createTimeBeforeYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/time-before-yesterday.js', () => ({
        __esModule: true,
        default: createTimeBeforeYesterdayRoutes
      }))
      require('../../smell/time-before-yesterday.js')
    })
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createTimeBeforeYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_TIME_BEFORE_YESTERDAY,
      redirect: {
        smellStrength: constants.routes.SMELL_SMELL_STRENGTH
      }
    })
  })
})
