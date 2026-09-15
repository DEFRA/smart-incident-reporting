import constants from '../../../utils/constants.js'

describe('dust/medical-help', () => {
  it('Should call createMedicalHealthRoutes with correct config', () => {
    const createMedicalHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/medical-help.js', () => ({
        __esModule: true,
        default: createMedicalHealthRoutes
      }))
      require('../../dust/medical-help.js')
    })
    expect(createMedicalHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createMedicalHealthRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_MEDICAL_HELP
    })
  })
})
