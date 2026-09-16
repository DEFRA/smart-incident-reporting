import constants from '../../../utils/constants.js'

describe('litter/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const createEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: createEffectOnHealthRoutes
      }))
      require('../../litter/effect-on-health.js')
    })
    expect(createEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_EFFECT_ON_HEALTH,
      redirect: {
        medicalHelp: constants.routes.LITTER_MEDICAL_HELP
      }
    })
  })
})
