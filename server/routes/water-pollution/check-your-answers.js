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
    const nowUtc = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, nowUtc.toISOString())

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
  const waterFeatureAnswer = getDataSet(request, 'WATER_POLLUTION_WATER_FEATURE')

  // Do we need to show map or location description
  const locationAnswer = getLocationAnswer(request, 'WATER_POLLUTION_LOCATION_OPTION')

  // Get answer for 'Less than 10m in size' question
  const lessThan10MetersAnswer = getData(request, 'WATER_POLLUTION_LESS_THAN_10_METRES')

  // Get answer for 'Less than 100 square meters in size' question
  const lessThan100SqMetersAnswer = getData(request, 'WATER_POLLUTION_LESS_THAN_100_SQ_METRES')

  // Check if 'Type of water' is measured in area
  const isMeasuredInArea = getIsMeasuredInArea(request)
  let lessThanSizeAnswer
  if (isMeasuredInArea) {
    lessThanSizeAnswer = lessThan100SqMetersAnswer
  } else {
    lessThanSizeAnswer = lessThan10MetersAnswer
  }

  // Check if 'Size (estimated)' option is required
  const isSizeEstimatedRequired = getIsSizeEstimatedRequired(request)
  let sizeEstimatedAnswer

  // Get answer for 'Size (estimated)' question
  if (isSizeEstimatedRequired) {
    const pollutionLengthAnswer = getData(request, 'WATER_POLLUTION_POLLUTION_LENGTH')
    const pollutionAreaAnswer = getData(request, 'WATER_POLLUTION_POLLUTION_AREA')

    sizeEstimatedAnswer = pollutionLengthAnswer || pollutionAreaAnswer
  }

  return {
    waterFeatureAnswer,
    locationAnswer,
    lessThanSizeAnswer,
    isMeasuredInArea,
    isSizeEstimatedRequired,
    sizeEstimatedAnswer
  }
}

// Get answers for 'About the pollution' section
const getAboutThePollution = (request) => {
  // Get answer for 'When did you see the pollution?' question
  const whenAnswer = getWhenData(request, 'WATER_POLLUTION_WHEN')

  // Get answer for 'What do you think the pollution is?' question
  const pollutionSubstanceAnswer = getDataSet(request, 'WATER_POLLUTION_POLLUTION_SUBSTANCE')

  // get answer for 'What does the pollution look like?' question
  const pollutionAppearanceAnswer = getDataSet(request, 'WATER_POLLUTION_POLLUTION_APPEARANCE')

  // Get answer for 'Do you know where the pollution is coming from?' question
  const pollutionSourceAnswer = getDataSet(request, 'WATER_POLLUTION_SOURCE')

  // Get answer for 'Have you seen any dead fish or animals?' question
  const effectOnWildlifeAnswer = getDataSet(request, 'WATER_POLLUTION_EFFECT_ON_WILDLIFE')

  // Get answer for 'Is there anything else you'd like to add?' question
  const otherInformationAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION) || 'No'

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
  if (recordedAnswer?.length === 1) {
    const selectedAnswerId = recordedAnswer[0].answerId
    const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
    const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
    return filterAnswer[0].shortText || filterAnswer[0].text
  } else if (recordedAnswer?.length > 1) {
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
  if (recordedAnswerSet?.otherDetails) {
    const joinData = recordedAnswerSet.answerText.join('<br>')
    answerData = `${joinData} - ${recordedAnswerSet.otherDetails}`
  } else if (recordedAnswerSet?.answerText) {
    answerData = recordedAnswerSet.answerText.join('<br>')
  } else {
    answerData = recordedAnswerSet
  }

  return answerData
}

// Get either map details or location description
const getLocationAnswer = (request, pageUrl) => {
  const locationOptionAnswer = getData(request, pageUrl)
  let locationAnswerData
  if (locationOptionAnswer) {
    if (locationOptionAnswer === questionSets.WATER_POLLUTION.questions[pageUrl].answers.description.text) {
      locationAnswerData = request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)[0].otherDetails
    } else {
      const location = request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_MAP)
      locationAnswerData = {
        point: [Number(location[1].otherDetails), Number(location[2].otherDetails)],
        disableControls: true,
        zoom: 10
      }
    }
  }
  return locationAnswerData
}

const getIsMeasuredInArea = (request) => {
  const waterFeatureAnswerData = request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)
  let isMeasuredInAreaData = false
  if (waterFeatureAnswerData) {
    const answerIsLakeorReservoir = waterFeatureAnswerData[0].answerId === questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE.answers.lakeOrReservoir.answerId
    const answerIsSea = waterFeatureAnswerData[0].answerId === questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE.answers.sea.answerId
    isMeasuredInAreaData = answerIsLakeorReservoir || answerIsSea
  }

  return isMeasuredInAreaData
}

const getIsSizeEstimatedRequired = (request) => {
  const lessThan10MetersAnswerData = request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)
  const lessThan100SqMetersAnswerData = request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)

  // Check if 'Size (estimated)' field is required
  let isSizeEstimatedRequiredData = false
  if (lessThan10MetersAnswerData && lessThan10MetersAnswerData[0].answerId === questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_10_METRES.answers.no.answerId) {
    isSizeEstimatedRequiredData = true
  } else if (lessThan100SqMetersAnswerData && lessThan100SqMetersAnswerData[0].answerId === questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_100_SQ_METRES.answers.no.answerId) {
    isSizeEstimatedRequiredData = true
  } else {
    // do nothing for sonarcloud
  }

  return isSizeEstimatedRequiredData
}

// Format date and time data
const getWhenData = (request, pageUrl) => {
  const whenAnswerData = request.yar.get(constants.redisKeys[pageUrl])
  let dateTimeData
  const pollutionDateAndTime = new Date(whenAnswerData)

  if (whenAnswerData) {
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
    const pollutionTime = date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h12',
      timeZone: 'Europe/London'
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

        const numPrefixOne = 1
        const numPrefixTwo = 2
        const numPrefixThree = 3

        switch (number % 10) {
          case numPrefixOne:
            return 'st'
          case numPrefixTwo:
            return 'nd'
          case numPrefixThree:
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
  return null
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
