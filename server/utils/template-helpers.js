// This is a location for storing helpers that are used by front end nunjucks templates

const findErrorMessageById = (errorSummary, id) => {
  return errorSummary?.errorList?.find((error) => error.href === `#${id}`)
}

export {
  findErrorMessageById
}
