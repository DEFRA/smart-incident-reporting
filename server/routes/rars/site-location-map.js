import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const createSiteLocationMapRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const getMapConfig = request => {
    const nearbySites = request.yar.get(constants.redisKeys.RARS_NEARBY_SITES) || []
    const address = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)?.selectedAddress?.[0]
    const sites = nearbySites
      .filter(site => Number.isFinite(site.easting) && Number.isFinite(site.northing))
      .map(({ id, name, easting, northing }) => ({ id, name, coords: oSGBToWGS84([easting, northing]) }))
    return {
      center: address ? oSGBToWGS84([address.x, address.y]) : sites[0]?.coords,
      sites
    }
  }

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_SITE_LOCATION_MAP, { ...serviceDetails, mapConfig: getMapConfig(request) })
    },
    post: async (request, h) => {
      const { answerId } = request.payload || {}
      const sites = request.yar.get(constants.redisKeys.RARS_NEARBY_SITES) || []
      const selectedSite = sites.find(site => site.id === answerId)

      if (!selectedSite) {
        return h.view(constants.views.RARS_SITE_LOCATION_MAP, { ...serviceDetails, mapConfig: getMapConfig(request) })
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

export default createSiteLocationMapRoutes
