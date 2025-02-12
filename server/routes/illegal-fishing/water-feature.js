import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_WATER_FEATURE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_WATER_FEATURE, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId, riverDetails, lakeOrReservoirDetails, canalDetails, streamOrWatercourseDetails, somethingElseDetails } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_WATER_FEATURE, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_WATER_FEATURE, buildAnswers(answerId, riverDetails, lakeOrReservoirDetails, canalDetails, streamOrWatercourseDetails, somethingElseDetails))
    // handle redirects
    return h.redirect(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
  }
}

const buildAnswers = (answerId, riverDetails, lakeOrReservoirDetails, canalDetails, streamOrWatercourseDetails, somethingElseDetails) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.river.answerId && riverDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.riverDetails.answerId,
      otherDetails: riverDetails
    })
  } else if (answerId === question.answers.lakeOrReservoir.answerId && lakeOrReservoirDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.lakeOrReservoirDetails.answerId,
      otherDetails: lakeOrReservoirDetails
    })
  } else if (answerId === question.answers.canal.answerId && canalDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.canalDetails.answerId,
      otherDetails: canalDetails
    })
  } else if (answerId === question.answers.streamOrWatercourse.answerId && streamOrWatercourseDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.streamOrWatercourseDetails.answerId,
      otherDetails: streamOrWatercourseDetails
    })
  } else if (answerId === question.answers.somethingElse.answerId && somethingElseDetails) {
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
    path: constants.routes.ILLEGAL_FISHING_WATER_FEATURE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_WATER_FEATURE,
    handler: handlers.post
  }
]
