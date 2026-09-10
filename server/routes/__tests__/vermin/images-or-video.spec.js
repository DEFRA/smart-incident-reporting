import constants from '../../../utils/constants.js'

describe('vermin/images-or-video', () => {
  it('Should call createImagesOrVideoRoutes with correct config', () => {
    const createImagesOrVideoRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/images-or-video.js', () => ({
        __esModule: true,
        createImagesOrVideoRoutes
      }))
      require('../../vermin/images-or-video.js')
    })

    expect(createImagesOrVideoRoutes).toHaveBeenCalledTimes(1)
    expect(createImagesOrVideoRoutes).toHaveBeenCalledWith({
      problem: 'vermin',
      route: constants.routes.VERMIN_IMAGES_OR_VIDEO,
      redirect: {
        contactDetails: constants.routes.VERMIN_CONTACT_DETAILS
      }
    })
  })
})
