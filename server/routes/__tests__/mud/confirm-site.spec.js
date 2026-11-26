import constants from '../../../utils/constants.js'

describe('mud/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../mud/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CONFIRM_SITE,
      redirect: {
        chooseSite: constants.routes.MUD_CHOOSE_SITE,
        sourceDetails: constants.routes.MUD_SOURCE_DETAILS,
        description: constants.routes.MUD_DESCRIPTION
      }
    })
  })
})
