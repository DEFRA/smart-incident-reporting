import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const createChooseSiteRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const sites = request.yar.get(constants.redisKeys.RARS_NEARBY_SITES) || []
      if (sites.length === 0) {
        return h.redirect(redirect.next)
      }
      return h.view(constants.views.RARS_CHOOSE_SITE, {
        ...serviceDetails,
        ...getContext(request, sites, redirect)
      })
    },
    post: async (request, h) => {
      const { answerId } = request.payload
      const sites = request.yar.get(constants.redisKeys.RARS_NEARBY_SITES) || []
      const selectedSite = sites.find(site => site.id === answerId)

      if (!selectedSite) {
        const errorSummary = getErrorSummary()
        errorSummary.errorList.push({
          text: 'Select a site',
          href: '#answerId-1'
        })
        return h.view(constants.views.RARS_CHOOSE_SITE, {
          ...serviceDetails,
          ...getContext(request, sites, redirect),
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_CONFIRM_SITE, { selectedSite })

      return h.redirect(redirect.confirmSite)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = (request, sites, redirect) => {
  const { selectedAddress } = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)
  const confirmedSite = request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)
  return {
    sites,
    resultlength: sites.length,
    postcode: selectedAddress[0].postcode,
    answer: confirmedSite?.selectedSite.id,
    chooseAddress: redirect.chooseAddress,
    siteNotListed: redirect.next
  }
}

export default createChooseSiteRoutes
