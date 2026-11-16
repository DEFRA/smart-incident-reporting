import constants from '../../../utils/constants.js'

describe('mud/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../mud/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CHOOSE_SITE,
      redirect: {
        confirmSite: constants.routes.MUD_CONFIRM_SITE,
        manualSite: constants.routes.MUD_SOURCE_DETAILS
      }
    })
  })
})
