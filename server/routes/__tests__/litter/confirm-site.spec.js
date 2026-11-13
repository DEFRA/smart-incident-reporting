import constants from '../../../utils/constants.js'

describe('litter/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../litter/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CONFIRM_SITE,
      redirect: {
        chooseSite: constants.routes.LITTER_CHOOSE_SITE,
        sourceDetails: constants.routes.LITTER_SOURCE_DETAILS,
        description: constants.routes.LITTER_DESCRIPTION
      }
    })
  })
})
