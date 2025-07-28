import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetail } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT, {
        errorSummary,
        ...getContext(request)
      })
    }

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(question.key, buildAnswers(answerId, somethingElseDetail))

    // handle routes based on fishing activity
    const activityQuestion = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ACTIVITY
    const activityAnswer = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)
    const protectedSpeciesSelected = activityAnswer.some(answer => Object.values(answer).includes(activityQuestion.answers.protectedSpecies.answerId))

    if (protectedSpeciesSelected) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
    }
  }
}

const buildAnswers = (answerId, somethingElseDetail) => {
  const answers = []

  answerId.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
  })

  if (answerId.indexOf(question.answers.somethingElse.answerId.toString()) > -1 && somethingElseDetail) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetail.answerId,
      otherDetails: somethingElseDetail
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
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select what equipment is being used or \'you do not know\'',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT,
    handler: handlers.post
  }
]
