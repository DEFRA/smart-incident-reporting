import constants from '../../../utils/constants.js'

describe('noise/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const createEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: createEffectOnHealthRoutes
      }))
      require('../../noise/effect-on-health.js')
    })
    expect(createEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_EFFECT_ON_HEALTH,
      redirect: {
        medicalHelp: constants.routes.NOISE_MEDICAL_HELP
      }
    })
  })
})
