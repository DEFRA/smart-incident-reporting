import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_OWNER

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_OWNER, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId, yesDetails } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    // validate payload
    const blockageTypeAnswers = request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)
    const blockageTypeAnswerId = blockageTypeAnswers?.[0]?.answerId
    const errorSummary = validatePayload(answerId, yesDetails, blockageTypeAnswerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_OWNER, {
        ...getContext(request),
        errorSummary,
        yesChecked: answerId === question.answers.yes.answerId
      })
    }

    request.yar.set(question.key, buildAnswers(answerId, yesDetails))

    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_START)
  }
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  const blockageTypeAnswers = request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)
  const blockageTypeAnswerId = blockageTypeAnswers?.[0]?.answerId

  return {
    question,
    answers,
    title: getTitle(blockageTypeAnswerId)
  }
}

const getTitle = (blockageTypeAnswerId) => {
  if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.vehicle.answerId) {
    return 'Do you know who is responsible for the vehicle?'
  } else if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.rubbish.answerId) {
    return 'Do you know who is responsible for the material blocking the river?'
  } else if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.fallenTree.answerId) {
    return 'Do you know who is responsible for the tree or vegetation?'
  } else {
    return 'Do you know who is responsible for causing the blockage?'
  }
}

const getErrorText = (blockageTypeAnswerId) => {
  if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.vehicle.answerId) {
    return 'Select \'yes\' if you know who owns the vehicle'
  } else if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.rubbish.answerId) {
    return 'Select \'yes\' if you know who is responsible for the material blocking the river'
  } else if (blockageTypeAnswerId === questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE.answers.fallenTree.answerId) {
    return 'Select \'yes\' if you know who is responsible for the tree or vegetation'
  } else {
    return 'Select \'yes\' if you know who is responsible for causing the blockage'
  }
}

const validatePayload = (answerId, yesDetails, blockageTypeAnswerId) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: getErrorText(blockageTypeAnswerId),
      href: '#answerId'
    })
  } else if (Number(answerId) === question.answers.yes.answerId && !yesDetails?.trim()) {
    errorSummary.errorList.push({
      text: 'Enter details about the person or company responsible',
      href: '#yesDetails'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const buildAnswers = (answerId, yesDetails) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })
  if (answerId === question.answers.yes.answerId) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.yesDetails.answerId,
      otherDetails: yesDetails
    })
  }
  return answers
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_OWNER,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_OWNER,
    handler: handlers.post
  }
]
