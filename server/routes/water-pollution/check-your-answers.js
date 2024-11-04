import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendMessage } from '../../services/service-bus.js'
import { validatePayload } from '../../utils/helpers.js'

const url = constants.routes

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_CHECK_YOUR_ANSWERS, {
      ...getContext(),
      ...getYourDetails(request),
      ...getLocationAndSizeOfPollution(request),
      ...getAboutThePollution(request)
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Build the payload to send to service bus
    const payload = buildPayload(request.yar)

    // test the payload against the schema
    if (!validatePayload(payload)) {
      throw new Error('Invalid payload')
    }

    await sendMessage(request.logger, payload)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

const getContext = () => {
  return {
    url
  }
}

// Get answers for 'Your details' section
const getYourDetails = (request) => {
  // Get answer for 'Name, Phone number and Email address' questions
  const { reporterName, reporterPhoneNumber, reporterEmailAddress } = request.yar.get(constants.redisKeys.HOME)

  // Get answer for 'Images or videos available' question
  const imagesOrVideoUrl = 'WATER_POLLUTION_IMAGES_OR_VIDEO'
  const imagesOrVideoAnswer = getData(request, imagesOrVideoUrl)

  return {
    reporterName,
    reporterPhoneNumber,
    reporterEmailAddress,
    imagesOrVideoAnswer
  }
}

// Get answers for 'Location and size of pollution' section
const getLocationAndSizeOfPollution = (request) => {
  // Get answer for 'Type of water' question
  const waterFeatureUrl = 'WATER_POLLUTION_WATER_FEATURE'
  const waterFeatureAnswer = getData(request, waterFeatureUrl)

  // Do we need to show map or location description
  const locationOptionUrl = 'WATER_POLLUTION_LOCATION_OPTION'
  console.log('Calling location data')
  const locationOptionAnswer = getData(request, locationOptionUrl)
  console.log('Data for locationOptionAnswer', locationOptionAnswer)
  let locationAnswer
  if (locationOptionAnswer) {
    if (locationOptionAnswer === questionSets.WATER_POLLUTION.questions[locationOptionUrl].answers.description.text) {
      locationAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)[0].otherDetails
    } else {
      const location = request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_MAP)
      locationAnswer = {
        point: [Number(location[1].otherDetails), Number(location[2].otherDetails)],
        disableControls: true,
        zoom: 10
      }
    }
  }

  // Get answer for 'Less than 10m in size' question
  const lessThan10MetersUrl = 'WATER_POLLUTION_LESS_THAN_10_METRES'
  const lessThan10MetersAnswer = getData(request, lessThan10MetersUrl)

  // get answer for 'Size (estimated)' question
  const pollutionLengthURL = 'WATER_POLLUTION_POLLUTION_LENGTH'
  const pollutionLengthAnswer = getData(request, pollutionLengthURL)

  return {
    waterFeatureAnswer,
    locationAnswer,
    lessThan10MetersAnswer,
    pollutionLengthAnswer
  }
}

// Get answers for 'About the pollution' section
const getAboutThePollution = (request) => {
  // Get answer for 'When did you see the pollution?' question
  const whenUrl = 'WATER_POLLUTION_WHEN'
  const whenAnswer = getWhenData(request, whenUrl)

  // Get answer for 'What do you think the pollution is?' question
  const pollutionSubstanceUrl = 'WATER_POLLUTION_POLLUTION_SUBSTANCE'
  const pollutionSubstanceAnswer = getDataSet(request, pollutionSubstanceUrl)

  // get answer for 'What does the pollution look like?' question
  const pollutionAppearanceUrl = 'WATER_POLLUTION_POLLUTION_APPEARANCE'
  const pollutionAppearanceAnswer = getDataSet(request, pollutionAppearanceUrl)

  // Get answer for 'Do you know where the pollution is coming from?' question
  const pollutionSourceUrl = 'WATER_POLLUTION_SOURCE'
  const pollutionSourceAnswer = getDataSet(request, pollutionSourceUrl)

  // Get answer for 'Have you seen any dead fish or animals?' question
  const effectOnWildlifeUrl = 'WATER_POLLUTION_EFFECT_ON_WILDLIFE'
  const effectOnWildlifeAnswer = getDataSet(request, effectOnWildlifeUrl)

  // Get answer for 'Is there anything else you'd like to add?' question
  const otherInformationUrl = 'WATER_POLLUTION_OTHER_INFORMATION'
  const otherInformationAnswerData = request.yar.get(constants.redisKeys[otherInformationUrl])
  let otherInformationAnswer

  if (otherInformationAnswer !== null && otherInformationAnswerData) {
    otherInformationAnswer = otherInformationAnswerData
  }

  return {
    whenAnswer,
    pollutionSubstanceAnswer,
    pollutionAppearanceAnswer,
    pollutionSourceAnswer,
    effectOnWildlifeAnswer,
    otherInformationAnswer
  }
}

// Get data and construct answers for the questions
const getData = (request, pageUrl) => {
  const recordedAnswer = request.yar.get(constants.redisKeys[pageUrl])
  console.log('Data for recorded Answer', recordedAnswer)
  if (recordedAnswer !== null && recordedAnswer.length === 1) {
    const selectedAnswerId = recordedAnswer[0].answerId
    const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
    const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
    return filterAnswer[0].shortText || filterAnswer[0].text
  } else if (recordedAnswer !== null && recordedAnswer.length > 1) {
    const multiAnswerSet = []
    let otherDetailsData

    for (const element of recordedAnswer) {
      const selectedAnswerId = element.answerId
      const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
      const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
      const answerText = filterAnswer[0].shortText
      if (answerText) {
        multiAnswerSet.push(answerText)
      }
      if (element.otherDetails) {
        otherDetailsData = element.otherDetails
      }
    }

    return {
      answerText: multiAnswerSet,
      otherDetails: otherDetailsData
    }
  } else {
    return null
  }
}

// Get data and construct multiple answers for the questions
const getDataSet = (request, pageUrl) => {
  const recordedAnswerSet = getData(request, pageUrl)
  let answerData
  if (recordedAnswerSet !== null && recordedAnswerSet.otherDetails) {
    const joinData = recordedAnswerSet.answerText.join('<br>')
    answerData = `${joinData} - ${recordedAnswerSet.otherDetails}`
  } else if (recordedAnswerSet !== null && recordedAnswerSet.answerText) {
    answerData = recordedAnswerSet.answerText.join('<br>')
  } else {
    answerData = recordedAnswerSet
  }

  return answerData
}

// Format date and time data
const getWhenData = (request, pageUrl) => {
  const whenAnswerData = request.yar.get(constants.redisKeys[pageUrl])
  let dateTimeData
  const pollutionDateAndTime = new Date(whenAnswerData)

  if (whenAnswerData !== null && whenAnswerData) {
    const checkIfToday = () => {
      const today = new Date()
      return pollutionDateAndTime.getDate() === today.getDate() &&
        pollutionDateAndTime.getMonth() === today.getMonth() &&
        pollutionDateAndTime.getFullYear() === today.getFullYear()
    }

    const checkIfYesterday = () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return pollutionDateAndTime.getDate() === yesterday.getDate() &&
        pollutionDateAndTime.getMonth() === yesterday.getMonth() &&
        pollutionDateAndTime.getFullYear() === yesterday.getFullYear()
    }

    const isToday = checkIfToday()
    const isYesterday = checkIfYesterday()

    const date = new Date(pollutionDateAndTime)
    const pollutionTime = date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    if (isToday) {
      dateTimeData = `Today at ${pollutionTime}`
    } else if (isYesterday) {
      dateTimeData = `Yesterday at ${pollutionTime}`
    } else {
      const dateObj = new Date(pollutionDateAndTime)
      const day = dateObj.getDate()
      const month = dateObj.toLocaleString('default', { month: 'long' })
      const year = dateObj.getFullYear()

      const nthNumber = (number) => {
        const numRangeStart = 3
        const numRangeEnd = 21
        if (number > numRangeStart && number < numRangeEnd) {
          return 'th'
        }

        switch (number % 10) {
          case 1:
            return 'st'
          case 2:
            return 'nd'
          case 3:
            return 'rd'
          default:
            return 'th'
        }
      }
      const pollutionDate = `${day}${nthNumber(day)} ${month} ${year}`
      dateTimeData = `${pollutionDate} at ${pollutionTime}`
    }

    return dateTimeData
  }
}

const buildPayload = (session) => {
  const reporter = session.get(constants.redisKeys.HOME)
  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      reportType: questionSets.WATER_POLLUTION.questionSetId,
      datetimeObserved: session.get(constants.redisKeys.WATER_POLLUTION_WHEN),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION),
      questionSetId: questionSets.WATER_POLLUTION.questionSetId,
      data: buildAnswerDataset(session, questionSets.WATER_POLLUTION),
      ...reporter
    }
  }
}

const buildAnswerDataset = (session, questionSet) => {
  const data = []
  Object.keys(questionSet.questions).forEach(key => {
    const answers = session.get(questionSet.questions[key].key)
    answers?.forEach(item => {
      data.push(item)
    })
  })
  return data
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS,
    handler: handlers.post
  }
]
