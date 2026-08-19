import constants from '../../../utils/constants.js'

describe('dust/when', () => {
  it('Should call createWhenRoutes with correct config', () => {
    const createWhenRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/when.js', () => ({
        __esModule: true,
        default: createWhenRoutes
      }))
      require('../../dust/when.js')
    })
    expect(createWhenRoutes).toHaveBeenCalledTimes(1)
    expect(createWhenRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_WHEN
    })
  })
})
