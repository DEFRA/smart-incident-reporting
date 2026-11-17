import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

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

      request.yar.set(constants.redisKeys.RARS_SOURCE_DETAILS, buildAnswers(selectedSite))

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

const buildAnswers = selectedSite => {
  const details = {
    siteName: selectedSite.name,
    sourceAddress: selectedSite.address,
    sourceTown: '',
    sourcePostcode: ''
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
