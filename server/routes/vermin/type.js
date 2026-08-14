import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.VERMIN_TYPE
const serviceDetails = getServiceDetails('vermin')

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.VERMIN_TYPE, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetail } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    // build answers and get selected vermin type
    const { answers, selectedType } = buildAnswers(answerId, somethingElseDetail)

    // flies skips the source journey so no answers to store
    if (answerId !== question.answers.flies.answerId) {
      request.yar.set(question.key, answers)
    }
    // if selected something else don't set it as the details, set it as "vermin/pests"
    request.yar.set(constants.redisKeys.VERMIN_TYPE_SELECTED, selectedType)

    // validate payload for errors
    const errorSummary = validatePayload(answerId, somethingElseDetail)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.VERMIN_TYPE, {
        errorSummary,
        ...getContext(request)
      })
    }
    return h.redirect(constants.routes.VERMIN_SOURCE)
  }
}

const buildAnswers = (answerId, somethingElseDetail) => {
  const answers = []
  const selectedTypeByAnswerId = {
    [question.answers.flies.answerId]: question.answers.flies.text.toLowerCase(),
    [question.answers.rats.answerId]: question.answers.rats.text.toLowerCase(),
    [question.answers.seagulls.answerId]: question.answers.seagulls.text.toLowerCase(),
    [question.answers.somethingElse.answerId]: 'vermin/pests'
  }
  const selectedType = selectedTypeByAnswerId[answerId] || ''

  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.somethingElse.answerId && somethingElseDetail) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetail.answerId,
      otherDetails: somethingElseDetail
    })
  }

  return { answers, selectedType }
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers,
    ...serviceDetails
  }
}

const validatePayload = (answerId, somethingElseDetail) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select what type of vermin or pest is causing a problem',
      href: '#answerId'
    })
    return errorSummary
  }
  if (answerId === question.answers.somethingElse.answerId && !somethingElseDetail) {
    errorSummary.errorList.push({
      text: 'Type of vermin or pest',
      href: '#somethingElseDetail'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.VERMIN_TYPE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.VERMIN_TYPE,
    handler: handlers.post
  }
]
