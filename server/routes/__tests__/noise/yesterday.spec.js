import constants from '../../../utils/constants.js'

describe('noise/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../noise/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.NOISE_WHEN_WORSE
      }
    })
  })
})
