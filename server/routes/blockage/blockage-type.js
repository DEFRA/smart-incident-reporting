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
    let { answerId, somethingElseDetails } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.BLOCKAGE_TYPE, buildAnswers(answerId, request))

    // validate payload for errors
    const errorSummary = validatePayload(answerId, somethingElseDetails)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_TYPE, {
        errorSummary,
        ...getContext(request)
      })
    }

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

const validatePayload = (answerId, somethingElseDetails) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select what\'s blocking the river or you do not know',
      href: '#answerId'
    })
  }
  // If something else option is selected , something details  feild should not be empty
  if ((Number(answerId) === question.answers.somethingElse.answerId) && (!somethingElseDetails)) {
    errorSummary.errorList.push({
      text: 'Enter details of what\'s blocking the river',
      href: '#somethingElseDetails'
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
