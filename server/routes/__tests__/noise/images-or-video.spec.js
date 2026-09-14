import constants from '../../../utils/constants.js'

describe('noise/images-or-video', () => {
  it('Should call createImagesOrVideoRoutes with correct config', () => {
    const createImagesOrVideoRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/images-or-video.js', () => ({
        __esModule: true,
        createImagesOrVideoRoutes
      }))
      require('../../noise/images-or-video.js')
    })

    expect(createImagesOrVideoRoutes).toHaveBeenCalledTimes(1)
    expect(createImagesOrVideoRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_IMAGES_OR_VIDEO,
      redirect: {
        contactDetails: constants.routes.NOISE_CONTACT_DETAILS
      }
    })
  })
})
