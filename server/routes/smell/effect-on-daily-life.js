import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_DAILY_LIFE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.SMELL_EFFECT_ON_DAILY_LIFE, {
    ...getContext()
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, putOffDetails, eventDetails, somethingElseDetails } = request.payload

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE, buildAnswers(answerId, putOffDetails, eventDetails, somethingElseDetails))

    return h.redirect(constants.routes.SMELL_EFFECT_ON_HEALTH)
  }
}

const buildAnswers = (answerId, putOffDetails, eventDetails, somethingElseDetails) => {
  const answers = []
  let goingElsewhere = false
  let cancelEvent = false
  let somethingElse = false

  // if no answer selected default to None of these
  if (answerId.length === 1 && !answerId[0]) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.noImpact.answerId
    })
  } else {
    answerId.forEach(item => {
      if (Number(item) === question.answers.goingElsewhere.answerId) {
        goingElsewhere = true
      }
      if (Number(item) === question.answers.cancelEvent.answerId) {
        cancelEvent = true
      }
      if (Number(item) === question.answers.somethingElse.answerId) {
        somethingElse = true
      }
      answers.push({
        ...baseAnswer,
        answerId: Number(item)
      })
    })
    if (goingElsewhere && putOffDetails) {
      answers.push({
        ...baseAnswer,
        answerId: question.answers.putOffDetails.answerId,
        otherDetails: putOffDetails
      })
    }
    if (cancelEvent && eventDetails) {
      answers.push({
        ...baseAnswer,
        answerId: question.answers.eventDetails.answerId,
        otherDetails: eventDetails
      })
    }
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

const getContext = () => {
  return {
    question
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: handlers.post
  }
]
