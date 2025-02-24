import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.FISHING.questions.FISHING_WATER_FEATURE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.FISHING_WATER_FEATURE, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.FISHING_WATER_FEATURE, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.FISHING_WATER_FEATURE, buildAnswers(answerId, request))
    // handle redirects
    return h.redirect(constants.routes.FISHING_LOCATION_OPTION)
  }
}

const buildAnswers = (answerId, request) => {
  const { riverDetails, lakeOrReservoirDetails, canalDetails, streamOrWatercourseDetails, somethingElseDetails } = request.payload
  let answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.river.answerId && riverDetails) {
    answers = setAnswers(answers, 'riverDetails', riverDetails)
  }
  if (answerId === question.answers.lakeOrReservoir.answerId && lakeOrReservoirDetails) {
    answers = setAnswers(answers, 'lakeOrReservoirDetails', lakeOrReservoirDetails)
  }
  if (answerId === question.answers.canal.answerId && canalDetails) {
    answers = setAnswers(answers, 'canalDetails', canalDetails)
  }
  if (answerId === question.answers.streamOrWatercourse.answerId && streamOrWatercourseDetails) {
    answers = setAnswers(answers, 'streamOrWatercourseDetails', streamOrWatercourseDetails)
  }
  answers = getSomethingElseDetails(answerId, answers, somethingElseDetails)
  return answers
}

const getSomethingElseDetails = (answerId, answers, somethingElseDetails) => {
  if (answerId === question.answers.somethingElse.answerId && somethingElseDetails) {
    answers = setAnswers(answers, 'somethingElseDetails', somethingElseDetails)
  }
  return answers
}

const setAnswers = (answers, waterFeatureData, waterFeatureDetails) => {
  answers.push({
    ...baseAnswer,
    answerId: question.answers[waterFeatureData].answerId,
    otherDetails: waterFeatureDetails
  })
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
    path: constants.routes.FISHING_WATER_FEATURE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.FISHING_WATER_FEATURE,
    handler: handlers.post
  }
]
