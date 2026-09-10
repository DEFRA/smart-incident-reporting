import constants from '../../../utils/constants.js'

describe('dust/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const mockCreateEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnHealthRoutes
      }))
      require('../../dust/effect-on-health.js')
    })
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_EFFECT_ON_HEALTH
    })
  })
})
