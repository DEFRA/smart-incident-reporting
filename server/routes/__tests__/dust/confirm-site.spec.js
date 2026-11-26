import constants from '../../../utils/constants.js'

describe('dust/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../dust/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CONFIRM_SITE,
      redirect: {
        chooseSite: constants.routes.DUST_CHOOSE_SITE,
        sourceDetails: constants.routes.DUST_SOURCE_DETAILS,
        description: constants.routes.DUST_DESCRIPTION
      }
    })
  })
})
