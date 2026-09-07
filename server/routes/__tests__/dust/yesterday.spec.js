import constants from '../../../utils/constants.js'

describe('dust/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../dust/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.DUST_WHEN_WORSE
      }
    })
  })
})
