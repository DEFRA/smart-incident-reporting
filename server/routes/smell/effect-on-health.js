import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_HEALTH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.SMELL_EFFECT_ON_HEALTH, {
    ...getContext()
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetails } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.SMELL_EFFECT_ON_HEALTH, {
        errorSummary,
        ...getContext()
      })
    }

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(constants.redisKeys.SMELL_EFFECT_ON_HEALTH, buildAnswers(answerId, somethingElseDetails))

    const currentAnswer = request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_HEALTH)
    if (currentAnswer.length === 1 && currentAnswer[0].answerId === question.answers.noneOfthese.answerId) {
      return h.redirect(constants.routes.SMELL_CONTACT)
    } else {
      return h.redirect(constants.routes.SMELL_MEDICAL_HELP)
    }
  }
}

const getContext = () => {
  return {
    question
  }
}

const buildAnswers = (answerId, somethingElseDetails) => {
  const answers = []
  let somethingElse = false

  answerId.forEach(item => {
    if (Number(item) === question.answers.somethingElse.answerId) {
      somethingElse = true
    }
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
  })
  if (somethingElse && somethingElseDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetails.answerId,
      otherDetails: somethingElseDetails
    })
  }

  return answers
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select any health conditions caused by the smell, or \'none of these\'',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EFFECT_ON_HEALTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_EFFECT_ON_HEALTH,
    handler: handlers.post
  }
]
