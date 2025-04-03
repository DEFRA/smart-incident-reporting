import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'
import isWorkingHours from '../../utils/is-working-hours.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    if (await isWorkingHours()) {
      request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.WATER_POLLUTION.questionSetId)
      return h.view(constants.views.WATER_POLLUTION_WATER_FEATURE, {
        ...getContext(request)
      })
    } else {
      // request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  },
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetails } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_WATER_FEATURE, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE, buildAnswers(answerId, somethingElseDetails))
    // handle redirects
    const refValue = request.yar.get(constants.redisKeys.REFERER)
    if (refValue) {
      if (answerId === question.answers.lakeOrReservoir.answerId || answerId === question.answers.sea.answerId) {
        request.yar.clear(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)
        return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
      } else {
        request.yar.clear(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
        return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
      }
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_LOCATION_OPTION)
    }
  }
}

const buildAnswers = (answerId, somethingElseDetails) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.somethingElse.answerId && somethingElseDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetails.answerId,
      otherDetails: somethingElseDetails
    })
  }

  return answers
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select a type of watercourse or feature, or you do not know',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_WATER_FEATURE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_WATER_FEATURE,
    handler: handlers.post
  }
]
