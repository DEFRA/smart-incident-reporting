import constants from '../../../utils/constants.js'
import sharedDaysWhenWorseRoutes from '../../rars/days-when-worse.js'
import dustDaysWhenWorseRoutes from '../../dust/days-when-worse.js'
import noiseDaysWhenWorseRoutes from '../../noise/days-when-worse.js'
import litterDaysWhenWorseRoutes from '../../litter/days-when-worse.js'
import mudDaysWhenWorseRoutes from '../../mud/days-when-worse.js'

describe('RARS days-when-worse routes', () => {
  it('Should render the shared days-when-worse view on GET', async () => {
    const h = {
      view: jest.fn(() => 'rendered-view')
    }

    const response = await sharedDaysWhenWorseRoutes[0].handler({}, h)

    expect(h.view).toHaveBeenCalledWith(constants.views.RARS_DAYS_WHEN_WORSE)
    expect(response).toBe('rendered-view')
  })

  it('Should redirect to the generic RARS location description on POST', async () => {
    const h = {
      redirect: jest.fn(() => 'redirected')
    }

    const response = await sharedDaysWhenWorseRoutes[1].handler({}, h)

    expect(h.redirect).toHaveBeenCalledWith(constants.routes.RARS_LOCATION_DESCRIPTION)
    expect(response).toBe('redirected')
  })

  it.each([
    ['dust', dustDaysWhenWorseRoutes, constants.routes.DUST_LOCATION_DESCRIPTION, constants.routes.DUST_DAYS_WHEN_WORSE],
    ['noise', noiseDaysWhenWorseRoutes, constants.routes.NOISE_LOCATION_DESCRIPTION, constants.routes.NOISE_DAYS_WHEN_WORSE],
    ['litter', litterDaysWhenWorseRoutes, constants.routes.LITTER_LOCATION_DESCRIPTION, constants.routes.LITTER_DAYS_WHEN_WORSE],
    ['mud', mudDaysWhenWorseRoutes, constants.routes.MUD_LOCATION_DESCRIPTION, constants.routes.MUD_DAYS_WHEN_WORSE]
  ])('Should handle %s days-when-worse GET and POST routes', (_, routes, locationDescriptionRoute, routePath) => {
    const viewHelper = { view: jest.fn(() => 'rendered-view') }
    const redirectHelper = { redirect: jest.fn(() => 'redirected') }

    expect(routes[0].path).toBe(routePath)
    expect(routes[1].path).toBe(routePath)

    const getResponse = routes[0].handler({}, viewHelper)
    expect(viewHelper.view).toHaveBeenCalledWith(constants.views.RARS_DAYS_WHEN_WORSE)
    return getResponse.then(response => {
      expect(response).toBe('rendered-view')
    }).then(async () => {
      const postResponse = await routes[1].handler({}, redirectHelper)
      expect(redirectHelper.redirect).toHaveBeenCalledWith(locationDescriptionRoute)
      expect(postResponse).toBe('redirected')
    })
  })
})
