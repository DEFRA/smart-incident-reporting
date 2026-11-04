import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS

const createChooseSiteRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const sites = request.yar.get(constants.redisKeys.RARS_NEARBY_SITES) || []
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
  const manualAddress = request.yar.get(constants.redisKeys.RARS_LOCATION_ADDRESS)
  const selectedAddress = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)?.selectedAddress
  const postcode = manualAddress?.find(
    answer => answer.answerId === addressQuestion.answers.postcode.answerId
  )?.otherDetails || selectedAddress?.[0]?.postcode
  const confirmedSite = request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)
  return {
    sites,
    resultlength: sites.length,
    postcode,
    answer: confirmedSite?.selectedSite.id,
    manualSite: redirect.manualSite
  }
}

export default createChooseSiteRoutes
