import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_DESCRIPTION

const bulletPointsByProblem = {
  noise: [
    'what type of sound it is, for example a buzzing or banging',
    'what it sounds similar to, for example a car engine or hammer',
    'what activity you think is causing the noise, for example car breaking or digging'
  ],
  dust: [
    'the colour of the dust',
    'how thick or coarse the dust is',
    'what substance the dust seems to be, for example is it soot, or metallic',
    'what activity you think is causing the dust'
  ],
  mud: [
    'the colour',
    'how deep it is',
    'if there is any smell',
    'what activity you think is causing the mud, for example large vehicles driving on verges'
  ],
  litter: [
    'what material the litter is made up of, for example is it household waste or packaging',
    'any distinctive or recognisable objects',
    'what activity you think is causing the litter, for example is it being dropped by vehicles'
  ]
}

const getBulletPoints = problem => bulletPointsByProblem[problem]

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.details.answerId
}

const createDescriptionRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_DESCRIPTION, {
        problem,
        ...getContext(request, problem),
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const { description } = request.payload

      // validate payload
      const errorSummary = validatePayload(description)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_DESCRIPTION, {
          question,
          problem,
          errorSummary,
          ...getContext(request, problem),
          ...serviceDetails
        })
      }

      request.yar.set(constants.redisKeys.RARS_DESCRIPTION, buildAnswers(description))

      return h.redirect(redirect.recurring)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = description => {
  const errorSummary = getErrorSummary()
  if (!description) {
    errorSummary.errorList.push({
      text: 'Enter a description',
      href: '#description'
    })
  }
  return errorSummary
}

const buildAnswers = otherDetails => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

const capitalise = text => text.charAt(0).toUpperCase() + text.slice(1)

const getContext = (request, problem) => {
  const { title, pageTitle } = titleHelper(request, question.text, question.text, problem)
  return { title: capitalise(title), pageTitle: capitalise(pageTitle), bulletPoints: getBulletPoints(problem) }
}

export default createDescriptionRoutes
