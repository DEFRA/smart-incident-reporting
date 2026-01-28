import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_LOCATION_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherLocationInfo } = request.payload

    if (otherLocationInfo) {
      request.yar.set(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION, buildAnswers(otherLocationInfo))
    }
    return h.redirect(constants.routes.BLOCKAGE_WHEN)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION)
  return {
    question,
    answers: answers?.[0]?.otherDetails
  }
}

const buildAnswers = otherDetails => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL,
    handler: handlers.post
  }
]
