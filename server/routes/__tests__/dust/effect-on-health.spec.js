import constants from '../../../utils/constants.js'

describe('dust/effect-on-health', () => {
  it('Should call createEffectOnHealthRoutes with correct config', () => {
    const createEffectOnHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/effect-on-health.js', () => ({
        __esModule: true,
        default: createEffectOnHealthRoutes
      }))
      require('../../dust/effect-on-health.js')
    })
    expect(createEffectOnHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createEffectOnHealthRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_EFFECT_ON_HEALTH,
      redirect: {
        medicalHelp: constants.routes.DUST_MEDICAL_HELP
      }
    })
  })
})
