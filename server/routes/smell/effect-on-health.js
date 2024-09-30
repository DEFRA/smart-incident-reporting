import constants from '../../utils/constants.js'
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

  // if no answer selected default to None of these
  if (answerId.length === 1 && !answerId[0]) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.noneOfthese.answerId
    })
  } else {
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
  }

  return answers
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
