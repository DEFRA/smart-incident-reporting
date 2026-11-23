import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import { SITE_FINDER_RESULT } from '../../utils/site-finder.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS

const createConfirmSiteRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const selectedSite = request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)?.selectedSite
      if (!selectedSite) {
        return h.redirect(redirect.chooseSite)
      }

      return h.view(constants.views.RARS_CONFIRM_SITE, {
        ...serviceDetails,
        selectedSite,
        chooseSite: redirect.chooseSite,
        enterSite: redirect.sourceDetails
      })
    },
    post: async (request, h) => {
      const selectedSite = request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)?.selectedSite
      if (!selectedSite) {
        return h.redirect(redirect.chooseSite)
      }

      const answers = buildAnswers(selectedSite)
      console.log('RARS_SOURCE_DETAILS answers stored:', JSON.stringify(answers, null, 2))
      request.yar.set(constants.redisKeys.RARS_SOURCE_DETAILS, answers)

      if (problem === 'vermin/pests') {
        return h.redirect(redirect.recurring)
      }
      return h.redirect(redirect.description)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const PERMIT_TYPES = {
  'waste-operations': 'Waste Operations',
  'industrial-installations': 'Industrial Installations'
}

const getPermitType = id => Object.entries(PERMIT_TYPES).find(([register]) => id?.includes(register))?.[1] || ''

const buildAnswers = selectedSite => {
  const details = {
    siteFinderUsed: SITE_FINDER_RESULT.COMPLETED,
    siteName: selectedSite.name,
    sourceAddress: selectedSite.streetAddress,
    sourceTown: selectedSite.town,
    sourcePostcode: selectedSite.postcode,
    registrationNumber: selectedSite.registrationNumber,
    permitType: getPermitType(selectedSite.id),
    distance: `${selectedSite.distance.toFixed(2)} km`,
    primaryActivity: selectedSite.primaryActivity,
    permitUrl: selectedSite.id.replace(/^http:/, 'https:')
  }

  // the primary activity is only available for industrial installations
  if (!details.primaryActivity) {
    delete details.primaryActivity
  }

  return Object.entries(details).map(([key, otherDetails]) => ({
    questionId: question.questionId,
    questionAsked: question.text,
    questionResponse: true,
    answerId: question.answers[key].answerId,
    otherDetails
  }))
}

export default createConfirmSiteRoutes
