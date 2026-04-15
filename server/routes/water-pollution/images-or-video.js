import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const yesAnswerId = question.answers.yes.answerId
const photosAnswerId = question.answers.photos.answerId
const videoAnswerId = question.answers.video.answerId
const noAnswerId = question.answers.no.answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const answerIds = getAnswerIds(request.payload.answerId)

    // validate payload
    const errorSummary = validatePayload(answerIds)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, buildAnswers(answerIds))

    // handle redirects
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
  }
}

const getContext = (request) => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = (answerId) => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select \'yes\' if you want to send us any images or videos',
      href: '#answerId'
    })
  }
  return errorSummary
}

const getAnswerIds = answerId => {
  if (!answerId) {
    return []
  }

  const answerArray = Array.isArray(answerId) ? answerId : [answerId]
  return answerArray.map(item => Number(item))
}

const buildAnswers = answerIds => {
  // User selected 'No'
  if (answerIds.includes(noAnswerId)) {
    return [{
      ...baseAnswer,
      answerId: noAnswerId
    }]
  }

  // User selected 'Photos' and/or 'Video' - always include 'Yes' response
  const selectedYesOptions = [photosAnswerId, videoAnswerId]
    .filter(id => answerIds.includes(id))

  return [
    {
      ...baseAnswer,
      answerId: yesAnswerId
    },
    ...selectedYesOptions.map(answerId => ({
      ...baseAnswer,
      answerId
    }))
  ]
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
