import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_IMAGES_OR_VIDEO
const yesPhotosAnswerId = question.answers.yesPhotos.answerId
const noPhotosAnswerId = question.answers.noPhotos.answerId
const yesVideoAnswerId = question.answers.yesVideo.answerId
const noVideoAnswerId = question.answers.noVideo.answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createImagesOrVideoRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_IMAGES_OR_VIDEO, {
        question,
        answers: request.yar.get(question.key),
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const answerIds = getAnswerIds(request.payload.answerId)
      const errorSummary = validatePayload(answerIds)

      if (errorSummary.errorList.length > 0) {
        request.yar.set(question.key, [])
        return h.view(constants.views.RARS_IMAGES_OR_VIDEO, {
          question,
          answers: buildAnswersForError(answerIds),
          errorSummary,
          ...serviceDetails
        })
      }

      request.yar.set(question.key, buildAnswers(answerIds))

      return h.redirect(redirect.contactDetails)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = answerIds => {
  const errorSummary = getErrorSummary()
  const validAnswerIds = new Set([yesPhotosAnswerId, yesVideoAnswerId, noPhotosAnswerId])
  const hasValidSelection = answerIds?.some(answerId => validAnswerIds.has(answerId))

  if (!hasValidSelection) {
    errorSummary.errorList.push({
      text: 'Select whether you have any photos or videos to include',
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
  return answerArray.map(Number)
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

export {
  createImagesOrVideoRoutes
}
