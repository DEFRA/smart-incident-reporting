import constants from '../../../utils/constants.js'

describe('smell/images-or-video', () => {
  it('Should call createImagesOrVideoRoutes with correct config', () => {
    const createImagesOrVideoRoutes = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('../../rars/images-or-video.js', () => ({
        __esModule: true,
        createImagesOrVideoRoutes
      }))
      require('../../smell/images-or-video.js')
    })

    expect(createImagesOrVideoRoutes).toHaveBeenCalledTimes(1)
    expect(createImagesOrVideoRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_IMAGES_OR_VIDEO,
      redirect: {
        contactDetails: constants.routes.SMELL_CONTACT_DETAILS
      }
    })
  })
})
