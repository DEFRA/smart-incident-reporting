import constants from '../../../utils/constants.js'

describe('mud/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const mockCreateEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: mockCreateEffectOnHealthRoutes
      }))
      require('../../mud/effect-on-health.js')
    })
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(mockCreateEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_EFFECT_ON_HEALTH
    })
  })
})
