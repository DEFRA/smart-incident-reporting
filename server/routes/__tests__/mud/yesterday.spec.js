import constants from '../../../utils/constants.js'

describe('mud/yesterday', () => {
  it('Should call createYesterdayRoutes with correct config', () => {
    const createYesterdayRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/yesterday.js', () => ({
        __esModule: true,
        default: createYesterdayRoutes
      }))
      require('../../mud/yesterday.js')
    })
    expect(createYesterdayRoutes).toHaveBeenCalledTimes(1)
    expect(createYesterdayRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.MUD_WHEN_WORSE
      }
    })
  })
})
