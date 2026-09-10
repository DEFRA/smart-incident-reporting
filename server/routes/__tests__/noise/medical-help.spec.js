import constants from '../../../utils/constants.js'

describe('noise/medical-help', () => {
  it('Should call createMedicalHealthRoutes with correct config', () => {
    const createMedicalHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/medical-help.js', () => ({
        __esModule: true,
        default: createMedicalHealthRoutes
      }))
      require('../../noise/medical-help.js')
    })
    expect(createMedicalHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createMedicalHealthRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_MEDICAL_HELP
    })
  })
})
