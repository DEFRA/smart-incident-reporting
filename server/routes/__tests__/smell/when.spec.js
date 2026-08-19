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
      route: constants.routes.SMELL_WHEN
    })
  })
})
