// This is a location for storing helpers that are used by front end nunjucks templates

const findErrorMessageById = (errorSummary, id) => {
  return errorSummary?.errorList?.find(error => error.href === `#${id}`)
}

const getAnswer = (answers, answerId) => {
  const answer = answers?.find(item => item.answerId === answerId)
  if (answer?.otherDetails) {
    return answer.otherDetails
  } else {
    return answer ? true : ''
  }
}

export {
  findErrorMessageById,
  getAnswer
}
