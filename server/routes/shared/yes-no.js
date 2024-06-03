import { getErrorSummary } from '../../utils/helpers.js'

const getHandler = question => {
  return async (_request, h) => {
    return h.view('smell/yes-no', {
      question
    })
  }
}

const postHandler = (question, routeFunction, key, errMessage) => {
  return async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId, errMessage)
    if (errorSummary.errorList.length > 0) {
      return h.view('smell/yes-no', {
        question,
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(key, buildAnswers(question, answerId))

    return routeFunction(h, answerId)
  }
}

const validatePayload = (answerId, errMessage) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: errMessage,
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = (question, answerId) => {
  const baseAnswer = {
    questionId: question.questionId,
    questionAsked: question.text,
    questionResponse: true
  }
  return [{
    ...baseAnswer,
    answerId
  }]
}

export {
  getHandler,
  postHandler
}
