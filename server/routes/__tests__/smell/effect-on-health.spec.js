import constants from '../../../utils/constants.js'

describe('smell/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const createEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: createEffectOnHealthRoutes
      }))
      require('../../smell/effect-on-health.js')
    })
    expect(createEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_EFFECT_ON_HEALTH
    })
  })
})
