import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_SUBSTANCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.WATER_POLLUTION_POLLUTION_SUBSTANCE, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetail } = request.payload

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(question.key, buildAnswers(answerId, somethingElseDetail))

    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
  }
}

const buildAnswers = (answerId, somethingElseDetail) => {
  const answers = []
  let somethingElse = false
  // if no answer selected default to You do not know
  if (answerId.length === 1 && !answerId[0]) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.unknown.answerId
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
    if (somethingElse && somethingElseDetail) {
      answers.push({
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: somethingElseDetail
      })
    }
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

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE,
    handler: handlers.post
  }
]
