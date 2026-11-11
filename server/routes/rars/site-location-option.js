import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const LIST = 'list'
const MAP = 'map'

const createSiteLocationOptionRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const getContext = request => ({
    ...serviceDetails,
    answer: request.yar.get(constants.redisKeys.RARS_SITE_LOCATION_OPTION),
    listValue: LIST,
    mapValue: MAP
  })

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_SITE_LOCATION_OPTION, getContext(request))
    },
    post: async (request, h) => {
      const { answerId } = request.payload || {}

      if (answerId !== LIST && answerId !== MAP) {
        const errorSummary = getErrorSummary()
        errorSummary.errorList.push({
          text: 'Select how you want to find the site',
          href: '#answerId'
        })
        return h.view(constants.views.RARS_SITE_LOCATION_OPTION, {
          ...getContext(request),
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_SITE_LOCATION_OPTION, answerId)

      return h.redirect(answerId === LIST ? redirect.chooseSite : redirect.siteLocationMap)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createSiteLocationOptionRoutes
