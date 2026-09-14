import constants from '../../../utils/constants.js'

describe('mud/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const createEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: createEffectOnHealthRoutes
      }))
      require('../../mud/effect-on-health.js')
    })
    expect(createEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_EFFECT_ON_HEALTH
    })
  })
})
