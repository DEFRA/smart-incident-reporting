import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const questionsByProblem = {
  smell: 'When did you most recently notice the smell',
  noise: 'When did you most recently hear the noise',
  vermin: 'When did you most recently notice the vermin/pests',
  dust: 'When did you most recently notice the dust',
  mud: 'When did you most recently notice the mud',
  litter: 'When did you most recently notice the litter'
}

const createWhenRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const questionText = questionsByProblem[problem]

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_WHEN, {
        problem,
        questionText,
        ...getContext(request),
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      // get payload
      let { answerId } = request.payload

      // validate payload for errors
      const errorSummary = validatePayload(answerId, problem)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_WHEN, {
          problem,
          questionText,
          errorSummary,
          ...getContext(request),
          ...serviceDetails
        })
      }

      // convert answerId to number
      answerId = Number(answerId)

      // set selected option in session, matching the water-pollution flow
      request.yar.set(constants.redisKeys.DATE_TIME_OPTION, answerId)

      // handle redirects based on when option selected
      const optionOne = 1
      const optionTwo = 2
      const optionThree = 3
      const optionFour = 4
      if (answerId === optionOne) {
        request.yar.set(constants.redisKeys.RARS_WHEN, (new Date()).toISOString())
        const nextRoute = redirect.whenWorse || redirect.smellStrength || redirect.effectOnDailyLife
        return h.redirect(nextRoute)
      } else if (answerId === optionTwo) {
        return h.redirect(redirect.earlierToday)
      } else if (answerId === optionThree) {
        return h.redirect(redirect.yesterday)
      } else if (answerId === optionFour) {
        return h.redirect(redirect.dateBeforeYesterday)
      }

      return null
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = request => {
  const answer = request.yar.get(constants.redisKeys.DATE_TIME_OPTION)
  return {
    answer
  }
}

const validatePayload = (answerId, problem) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    const incidentType = problem === 'noise'
      ? 'noise'
      : problem === 'vermin'
        ? 'vermin/pests'
        : problem

    errorSummary.errorList.push({
      text: problem === 'noise'
        ? 'Select when you heard the noise'
        : `Select when you noticed the ${incidentType}`,
      href: '#answerId'
    })
  }
  return errorSummary
}

export default createWhenRoutes
