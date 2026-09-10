import constants from '../../../utils/constants.js'

describe('litter/medical-help', () => {
  it('Should call createMedicalHealthRoutes with correct config', () => {
    const createMedicalHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/medical-help.js', () => ({
        __esModule: true,
        default: createMedicalHealthRoutes
      }))
      require('../../litter/medical-help.js')
    })
    expect(createMedicalHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createMedicalHealthRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_MEDICAL_HELP
    })
  })
})
