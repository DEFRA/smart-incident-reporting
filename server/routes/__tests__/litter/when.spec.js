import constants from '../../../utils/constants.js'

describe('litter/when', () => {
  it('Should call createWhenRoutes with correct config', () => {
    const createWhenRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when.js', () => ({
        __esModule: true,
        default: createWhenRoutes
      }))
      require('../../litter/when.js')
    })
    expect(createWhenRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_WHEN,
      redirect: {
        whenWorse: constants.routes.LITTER_WHEN_WORSE,
        earlierToday: constants.routes.LITTER_EARLIER_TODAY,
        yesterday: constants.routes.LITTER_YESTERDAY,
        dateBeforeYesterday: constants.routes.LITTER_DATE_BEFORE_YESTERDAY
      }
    })
  })
})
