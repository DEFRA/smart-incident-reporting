import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const questionsByProblem = {
  smell: 'Do you notice the smell is worse on certain days or a particular time',
  noise: 'Do you notice the noise is worse on certain days or a particular time',
  vermin: 'Do you notice the vermin/pests are worse on certain days or a particular time',
  dust: 'Do you notice the dust is worse on certain days or a particular time',
  mud: 'Do you notice the mud is worse on certain days or a particular time',
  litter: 'Do you notice the litter is worse on certain days or a particular time'
}

const createWhenWorseRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const questionText = questionsByProblem[problem]

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_WHEN_WORSE, {
        questionText,
        ...getContext(request),
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      // get payload
      let { answerId } = request.payload

      // validate payload for errors
      const errorSummary = validatePayload(answerId)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_WHEN_WORSE, {
          questionText,
          ...getContext(request),
          errorSummary,
          ...serviceDetails
        })
      }

      // convert answerId to number
      answerId = Number(answerId)

      // set answer in session
      request.yar.set(constants.redisKeys.RARS_WHEN_WORSE, answerId)

      // redirect to the special shared RARS days page
      return h.redirect(redirect.daysWhenWorse)
    }
  }

  const getContext = request => {
    const answers = request.yar.get(constants.redisKeys.RARS_WHEN_WORSE)
    return {
      answers
    }
  }

  const validatePayload = answerId => {
    const errorSummary = getErrorSummary()
    if (!answerId) {
      let incidentType = problem
      if (problem === 'noise') {
        incidentType = 'noise'
      } else if (problem === 'vermin') {
        incidentType = 'vermin/pests'
      } else {
        // do nothing
      }

      errorSummary.errorList.push({
        text: `Select if the ${incidentType} is worse on certain days`,
        href: '#answerId'
      })
    }
    return errorSummary
  }

  return [
    {
      method: 'GET',
      path: route,
      handler: handlers.get
    },
    {
      method: 'POST',
      path: route,
      handler: handlers.post
    }
  ]
}

export default createWhenWorseRoutes
