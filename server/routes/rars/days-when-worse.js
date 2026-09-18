import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_DAYS_WHEN_WORSE

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const NO_PARTICULAR_DAY = 'No particular day'

// the selected days are stored against a single answer id as a semicolon
// separated list, for example 'Monday;Tuesday;Sunday'
const ANSWER_SEPARATOR = ';'

// noise is the only RARS journey that is heard rather than noticed
const getPresentTenseVerb = problem => problem === 'noise' ? 'hear' : 'notice'
const getPastTenseVerb = problem => problem === 'noise' ? 'heard' : 'noticed'

const getSelectedDays = answerId => {
  if (!answerId) {
    return []
  }

  const submitted = new Set(Array.isArray(answerId) ? answerId : [answerId])

  if (submitted.has(NO_PARTICULAR_DAY)) {
    return [NO_PARTICULAR_DAY]
  }

  // preserve week order rather than the order the browser posted them in
  return days.filter(day => submitted.has(day))
}

const getStoredDays = request => {
  const storedValue = request.yar.get(question.key)?.[0]?.otherDetails
  return storedValue ? storedValue.split(ANSWER_SEPARATOR) : []
}

const buildCheckboxItems = selected => {
  const items = days.map(day => ({
    value: day,
    text: day,
    checked: selected.includes(day)
  }))

  items.push({ divider: 'or' })
  items.push({
    value: NO_PARTICULAR_DAY,
    text: NO_PARTICULAR_DAY,
    behaviour: 'exclusive',
    checked: selected.includes(NO_PARTICULAR_DAY)
  })

  return items
}

const createDaysWhenWorseRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const questionText = question.text
    .replace('{verb}', getPresentTenseVerb(problem))
    .replace('{problem}', problem)
  const errorText = `Select when you ${getPastTenseVerb(problem)} the ${problem}?`

  const getContext = selected => ({
    question,
    questionText,
    items: buildCheckboxItems(selected),
    ...serviceDetails
  })

  const validatePayload = selected => {
    const errorSummary = getErrorSummary()
    if (selected.length === 0) {
      errorSummary.errorList.push({
        text: errorText,
        href: '#answerId'
      })
    }
    return errorSummary
  }

  const buildAnswers = selected => [{
    questionId: question.questionId,
    questionAsked: questionText,
    questionResponse: true,
    answerId: question.answers.days.answerId,
    otherDetails: selected.join(ANSWER_SEPARATOR)
  }]

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_DAYS_WHEN_WORSE, getContext(getStoredDays(request)))
    },
    post: async (request, h) => {
      const selected = getSelectedDays(request.payload.answerId)

      const errorSummary = validatePayload(selected)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_DAYS_WHEN_WORSE, {
          ...getContext(selected),
          errorSummary
        })
      }

      request.yar.set(question.key, buildAnswers(selected))

      return h.redirect(redirect.timesWhenWorse)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createDaysWhenWorseRoutes
