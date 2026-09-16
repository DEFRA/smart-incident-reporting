import constants from '../../../utils/constants.js'

describe('litter/images-or-video', () => {
  it('Should call createImagesOrVideoRoutes with correct config', () => {
    const createImagesOrVideoRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/images-or-video.js', () => ({
        __esModule: true,
        createImagesOrVideoRoutes
      }))
      require('../../litter/images-or-video.js')
    })

    expect(createImagesOrVideoRoutes).toHaveBeenCalledTimes(1)
    expect(createImagesOrVideoRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_IMAGES_OR_VIDEO,
      redirect: {
        contactDetails: constants.routes.LITTER_CONTACT_DETAILS
      }
    })
  })
})
