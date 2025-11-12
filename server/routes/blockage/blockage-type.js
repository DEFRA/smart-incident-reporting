import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_TYPE, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_TYPE, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.BLOCKAGE_TYPE, buildAnswers(answerId, request))
    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_LOCATION_OPTION)
  }
}

const buildAnswers = (answerId, request) => {
  const { somethingElseDetails } = request.payload
  let answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  answers = getSomethingElseDetails(answerId, answers, somethingElseDetails)
  return answers
}

const getSomethingElseDetails = (answerId, answers, somethingElseDetails) => {
  if (answerId === question.answers.somethingElse.answerId && somethingElseDetails) {
    answers = setAnswers(answers, 'somethingElseDetails', somethingElseDetails)
  }
  return answers
}

const setAnswers = (answers, blockageTypeData, blockageTypeDetails) => {
  answers.push({
    ...baseAnswer,
    answerId: question.answers[blockageTypeData].answerId,
    otherDetails: blockageTypeDetails
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
      text: 'Select what is blocking the river or you do not know',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_TYPE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_TYPE,
    handler: handlers.post
  }
]
