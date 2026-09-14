import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_TIMES_WHEN_WORSE

const times = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night'
]

const NO_PARTICULAR_DAY = 'No particular day'

// the selected times are stored against a single answer id as a semicolon
// separated list, for example 'Morning;Afternoon;Night'
const ANSWER_SEPARATOR = ';'

// noise is the only RARS journey that is heard rather than noticed
const getPresentTenseVerb = problem => problem === 'noise' ? 'hear' : 'notice'
const getPastTenseVerb = problem => problem === 'noise' ? 'heard' : 'noticed'

const getSelectedTimes = answerId => {
  if (!answerId) {
    return []
  }

  const submitted = new Set(Array.isArray(answerId) ? answerId : [answerId])

  if (submitted.has(NO_PARTICULAR_DAY)) {
    return [NO_PARTICULAR_DAY]
  }

  // preserve time of day order rather than the order the browser posted them in
  return times.filter(time => submitted.has(time))
}

const getStoredTimes = request => {
  const storedValue = request.yar.get(question.key)?.[0]?.otherDetails
  return storedValue ? storedValue.split(ANSWER_SEPARATOR) : []
}

const buildCheckboxItems = selected => {
  const items = times.map(time => ({
    value: time,
    text: time,
    checked: selected.includes(time)
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

const createTimesWhenWorseRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const questionText = question.text
    .replace('{verb}', getPresentTenseVerb(problem))
    .replace('{problem}', problem)
  const errorText = `Select the time of the day you ${getPastTenseVerb(problem)} the ${problem}?`

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
    answerId: question.answers.times.answerId,
    otherDetails: selected.join(ANSWER_SEPARATOR)
  }]

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_TIMES_WHEN_WORSE, getContext(getStoredTimes(request)))
    },
    post: async (request, h) => {
      const selected = getSelectedTimes(request.payload.answerId)

      const errorSummary = validatePayload(selected)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_TIMES_WHEN_WORSE, {
          ...getContext(selected),
          errorSummary
        })
      }

      request.yar.set(question.key, buildAnswers(selected))

      return h.redirect(redirect.effectOnDailyLife)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createTimesWhenWorseRoutes
