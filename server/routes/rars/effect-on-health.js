import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getServiceDetails, getErrorSummary, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_EFFECT_ON_HEALTH
const verminQuestion = 'Do you know the site or business responsible for the {vermin}?'

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createEffectOnHealthroutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      const { title, pageTitle } = titleHelper(_request, question.text, verminQuestion, problem)
      return h.view(constants.views.RARS.EFFECT_ON_HEALTH, {
        question,
        problem,
        title,
        pageTitle,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId, somethingElseDetails } = request.payload
      const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
      const errorSummary = validatePayload(answerId, request, problem)
      if (errorSummary.errorlist.length > 0) {
        request.yar.set(question.key, [])
        return h.view(constants.views.RARS.EFFECT_ON_HEALTH, {
          question,
          problem,
          title,
          pageTitle,
          errorSummary,
          ...serviceDetails
        })
      }

      // Convert the answer to an array object is only a single string
      if (!Array.isArray(answerId)) {
        answerId = [answerId]
      }

      // set the answer in the session
      request.yar.set(constants.redisKeys.RARS_EFFECT_ON_HEALTH, buildAnswer(answerId, somethingElseDetails))
      return h.redirect(redirect.medicalHelp)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const buildAnswer = (answerId, somethingElseDetails) => {
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

const validatePayload = (answerId, request, problem) => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    const selectedProblem = problem === 'vermin'
      ? (request?.yar?.get(constants.redisKeys.VERMIN_TYPE_SELECTED) || 'vermin')
      : problem

    errorSummary.errorList.push({
      text: `Select any health conditions caused by the ${selectedProblem}, or 'none of these'`,
      href: '#answerId'
    })
  }
  return errorSummary
}

export default createEffectOnHealthroutes
