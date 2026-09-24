import constants from '../../../utils/constants.js'

describe('litter/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../litter/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.LITTER_WHEN_WORSE
      }
    })
  })
})
