import constants from '../../../utils/constants.js'

describe('smell/when', () => {
  it('Should call createWhenRoutes with correct config', () => {
    const createWhenRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when.js', () => ({
        __esModule: true,
        default: createWhenRoutes
      }))
      require('../../smell/when.js')
    })
    expect(createWhenRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_WHEN,
      redirect: {
        smellStrength: constants.routes.SMELL_SMELL_STRENGTH,
        earlierToday: constants.routes.SMELL_EARLIER_TODAY,
        yesterday: constants.routes.SMELL_YESTERDAY,
        dateBeforeYesterday: constants.routes.SMELL_DATE_BEFORE_YESTERDAY
      }
    })
  })
})
