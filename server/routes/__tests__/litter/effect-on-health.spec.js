import constants from '../../../utils/constants.js'

describe('litter/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const mockCreateEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnHealthRoutes
      }))
      require('../../litter/effect-on-health.js')
    })
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_EFFECT_ON_HEALTH
    })
  })
})
