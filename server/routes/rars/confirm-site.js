import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'

const createConfirmSiteRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const confirmedSite = request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)
      if (!confirmedSite) {
        return h.redirect(redirect.chooseSite)
      }
      return h.view(constants.views.RARS_CONFIRM_SITE, {
        ...serviceDetails,
        site: confirmedSite.selectedSite,
        chooseSite: redirect.chooseSite,
        siteNotListed: redirect.next
      })
    },
    post: async (_request, h) => {
      return h.redirect(redirect.next)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createConfirmSiteRoutes
