import constants from '../../../utils/constants.js'

describe('pests/medical-help', () => {
  it('Should call createMedicalHealthRoutes with correct config', () => {
    const createMedicalHealthRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/medical-help.js', () => ({
        __esModule: true,
        default: createMedicalHealthRoutes
      }))
      require('../../pests/medical-help.js')
    })
    expect(createMedicalHealthRoutes).toHaveBeenCalledTimes(1)
    expect(createMedicalHealthRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_MEDICAL_HELP,
      redirect: {
        imagesOrVideo: constants.routes.PESTS_IMAGES_OR_VIDEO
      }
    })
  })
})
