import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_EFFECT_ON_DAILY_LIFE
const verminQuestion = 'Do you know the site or business responsible for the {vermin}?'

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createEffectOnDailyLifeRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
      return h.view(constants.views.RARS_EFFECT_ON_DAILY_LIFE, {
        question,
        problem,
        title,
        pageTitle,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId, putOffDetails, eventDetails, somethingElseDetails } = request.payload
      const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
      const errorSummary = validatePayload(answerId, request, problem)
      if (errorSummary.errorList.length > 0) {
        request.yar.set(question.key, [])
        return h.view(constants.views.RARS_EFFECT_ON_DAILY_LIFE, {
          errorSummary,
          question,
          problem,
          title,
          pageTitle,
          ...serviceDetails
        })
      }

      // Convert answer to array if only a single string answer
      if (!Array.isArray(answerId)) {
        answerId = [answerId]
      }

      // set answer in session
      request.yar.set(constants.redisKeys.RARS_EFFECT_ON_DAILY_LIFE, buildAnswers(answerId, putOffDetails, eventDetails, somethingElseDetails))

      return h.redirect(redirect.effectOnHealth)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const buildAnswers = (answerId, putOffDetails, eventDetails, somethingElseDetails) => {
  const answers = []
  let goingElsewhere = false
  let cancelEvent = false
  let somethingElse = false

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

  return answers
}

const validatePayload = (answerId, request, problem) => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    const selectedProblem = problem === 'vermin'
      ? (request?.yar?.get(constants.redisKeys.VERMIN_TYPE_SELECTED) || 'vermin')
      : problem

    errorSummary.errorList.push({
      text: `Select any of the following you did because of the ${selectedProblem}, or 'none of these'`,
      href: '#answerId'
    })
  }
  return errorSummary
}

export default createEffectOnDailyLifeRoutes
