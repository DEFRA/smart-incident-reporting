// This is a location for storing helpers that are used by front end nunjucks templates

const findErrorMessageById = (errorSummary, id) => {
  return errorSummary?.errorList?.find(error => error.href === `#${id}`)
}

const getAnswer = (answers, answerId) => {
  const answer = answers?.find(item => item.answerId === answerId)
  return answer?.otherDetails ? answer.otherDetails : !!answer
}

export {
  findErrorMessageById,
  getAnswer
}
