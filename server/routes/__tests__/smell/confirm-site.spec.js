import constants from '../../../utils/constants.js'

describe('smell/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../smell/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_CONFIRM_SITE
    })
  })
})
