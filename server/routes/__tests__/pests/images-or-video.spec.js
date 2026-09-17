import constants from '../../../utils/constants.js'

describe('pests/images-or-video', () => {
  it('Should call createImagesOrVideoRoutes with correct config', () => {
    const createImagesOrVideoRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/images-or-video.js', () => ({
        __esModule: true,
        createImagesOrVideoRoutes
      }))
      require('../../pests/images-or-video.js')
    })

    expect(createImagesOrVideoRoutes).toHaveBeenCalledTimes(1)
    expect(createImagesOrVideoRoutes).toHaveBeenCalledWith({
      problem: 'pests',
      route: constants.routes.PESTS_IMAGES_OR_VIDEO,
      redirect: {
        contactDetails: constants.routes.PESTS_CONTACT_DETAILS
      }
    })
  })
})
