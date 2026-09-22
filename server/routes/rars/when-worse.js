import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const questionsByProblem = {
  smell: 'Do you notice the smell is worse on certain days or a particular time',
  noise: 'Do you notice the noise is worse on certain days or a particular time',
  'vermin/pests': 'Do you notice the vermin/pests are worse on certain days or a particular time',
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
        question,
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
          question,
          questionText,
          ...getContext(request),
          errorSummary,
          ...serviceDetails
        })
      }

      // convert answerId to number
      answerId = Number(answerId)

      // set answer in session
      request.yar.set(constants.redisKeys.RARS_WHEN_WORSE, buildAnswers(answerId))

      // answering 'No' skips the days and times pages
      if (answerId === question.answers.no.answerId) {
        return h.redirect(redirect.effectOnDailyLife)
      }

      // pests has no days-when-worse page, so it goes straight to effect-on-daily-life
      return h.redirect(redirect.daysWhenWorse ?? redirect.effectOnDailyLife)
    }
  }

  const getContext = request => {
    const answers = request.yar.get(constants.redisKeys.RARS_WHEN_WORSE)
    return {
      answers
    }
  }

  const buildAnswers = answerId => {
    return [{
      ...baseAnswer,
      answerId
    }]
  }

  const validatePayload = answerId => {
    const errorSummary = getErrorSummary()
    if (!answerId) {
      const verb = problem === 'vermin/pests' ? 'are' : 'is'

      errorSummary.errorList.push({
        text: `Select if the ${problem} ${verb} worse on certain days`,
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
