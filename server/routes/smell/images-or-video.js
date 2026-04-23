import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO
const yesPhotosAnswerId = question.answers.yesPhotos.answerId
const noPhotosAnswerId = question.answers.noPhotos.answerId
const yesVideoAnswerId = question.answers.yesVideo.answerId
const noVideoAnswerId = question.answers.noVideo.answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_IMAGES_OR_VIDEO, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const answerIds = getAnswerIds(request.payload.answerId)

    // validate payload
    const errorSummary = validatePayload(answerIds)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.SMELL_IMAGES_OR_VIDEO, {
        question,
        answers: buildAnswersForError(answerIds),
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.SMELL_IMAGES_OR_VIDEO, buildAnswers(answerIds))

    // handle redirects
    return h.redirect(constants.routes.SMELL_CONTACT_DETAILS)
  }
}

const getContext = (request) => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = (answerIds) => {
  const errorSummary = getErrorSummary()
  const validAnswerIds = [yesPhotosAnswerId, yesVideoAnswerId, noPhotosAnswerId]
  const hasValidSelection = answerIds && answerIds.some(answerId => validAnswerIds.includes(answerId))

  if (!hasValidSelection) {
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
  const selectedPhotos = answerIds.includes(yesPhotosAnswerId)
  const selectedVideo = answerIds.includes(yesVideoAnswerId)
  const selectedNo = answerIds.includes(noPhotosAnswerId)

  if (selectedNo) {
    return [
      {
        ...baseAnswer,
        answerId: noPhotosAnswerId
      },
      {
        ...baseAnswer,
        answerId: noVideoAnswerId
      }
    ]
  }

  if (selectedPhotos && selectedVideo) {
    return [
      {
        ...baseAnswer,
        answerId: yesPhotosAnswerId
      },
      {
        ...baseAnswer,
        answerId: yesVideoAnswerId
      }
    ]
  }

  if (selectedPhotos) {
    return [
      {
        ...baseAnswer,
        answerId: yesPhotosAnswerId
      },
      {
        ...baseAnswer,
        answerId: noVideoAnswerId
      }
    ]
  }

  return [
    {
      ...baseAnswer,
      answerId: noPhotosAnswerId
    },
    {
      ...baseAnswer,
      answerId: yesVideoAnswerId
    }
  ]
}

const buildAnswersForError = answerIds => {
  if (!answerIds || answerIds.length === 0) {
    return []
  }

  return answerIds.map(answerId => ({
    ...baseAnswer,
    answerId
  }))
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
