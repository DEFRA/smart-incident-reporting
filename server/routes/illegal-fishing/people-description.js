import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_PEOPLE_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, buildAnswers(answerId))

    // handle routes based on fishing activity
    const activityQuestion = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ACTIVITY
    const activityAnswer = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)
    const illegalEquipmentSelected = activityAnswer.some(answer => Object.values(answer).includes(activityQuestion.answers.illegalFishingEquipment.answerId))
    const protectedSpeciesSelected = activityAnswer.some(answer => Object.values(answer).includes(activityQuestion.answers.protectedSpecies.answerId))
    console.log('Data for activityAnswer', activityAnswer)

    if (answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_DESCRIPTION_DETAILS)
    } else {
      if (illegalEquipmentSelected) {
        return h.redirect(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
      } else if (protectedSpeciesSelected) {
        return h.redirect(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
      } else {
        return h.redirect(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
      }
    }
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select \'yes\' if you can describe anyone involved',
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
    handler: handlers.post
  }
]
