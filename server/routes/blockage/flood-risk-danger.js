import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_FLOOD_RISK_DANGER

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.BLOCKAGE_FLOOD_RISK_DANGER, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetail, commercialPropertyDetail } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId, somethingElseDetail, commercialPropertyDetail)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.BLOCKAGE_FLOOD_RISK_DANGER, {
        errorSummary,
        ...getContext(request)
      })
    }

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(question.key, buildAnswers(answerId, somethingElseDetail, commercialPropertyDetail))

    return h.redirect(constants.routes.BLOCKAGE_OWNER)
  }
}

const buildAnswers = (answerId, somethingElseDetail, commercialPropertyDetail) => {
  const answers = []

  answerId.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
  })

  if (answerId.includes(question.answers.somethingElse.answerId.toString()) && somethingElseDetail) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetail.answerId,
      otherDetails: somethingElseDetail
    })
  }
  if (answerId.includes(question.answers.commercialProperty.answerId.toString()) && commercialPropertyDetail) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.commercialPropertyDetail.answerId,
      otherBuildingDetail: commercialPropertyDetail
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

const validatePayload = (answerId, somethingElseDetail, commercialPropertyDetail) => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select what is at risk from flooding, or \'you do not know\'',
      href: '#answerId'
    })
  } else if (answerId.length > 0 && (answerId.includes(question.answers.somethingElse.answerId.toString()) && !somethingElseDetail)) {
    errorSummary.errorList.push({
      text: 'Enter details about what is at risk from flooding',
      href: '#answerId'
    })
  } else if (answerId.length > 0 && (answerId.includes(question.answers.commercialProperty.answerId.toString()) && !commercialPropertyDetail)) {
    errorSummary.errorList.push({
      text: 'Enter details about the type of buildings at risk from flooding',
      href: '#answerId'
    })
  } else {
    // do nothing (sonarcloud made me do this)
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_FLOOD_RISK_DANGER,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_FLOOD_RISK_DANGER,
    handler: handlers.post
  }
]
