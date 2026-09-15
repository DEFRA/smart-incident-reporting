import constants from '../../../utils/constants.js'

describe('vermin/medical-help', () => {
  it('Should call createMedicalHealthRoutes with correct config', () => {
    const createMedicalHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/medical-help.js', () => ({
        __esModule: true,
        default: createMedicalHealthRoutes
      }))
      require('../../vermin/medical-help.js')
    })
    expect(createMedicalHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createMedicalHealthRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_MEDICAL_HELP
    })
  })
})
