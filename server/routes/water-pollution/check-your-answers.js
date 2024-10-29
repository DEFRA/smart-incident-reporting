import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const url = constants.routes

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_CHECK_YOUR_ANSWERS, {
      ...getContext(),
      ...getYourDetails(request),
      ...getLocationAndSizeOfPollution(request),
      ...getAboutThePollution(request)
    })
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

  // Get answer for 'Less than 10m in size' question
  const lessThan10MetersUrl = 'WATER_POLLUTION_LESS_THAN_10_METRES'
  const lessThan10MetersAnswer = getData(request, lessThan10MetersUrl)

  // get answer for 'Size (estimated)' question
  const pollutionLengthURL = 'WATER_POLLUTION_POLLUTION_LENGTH'
  const pollutionLengthAnswer = getData(request, pollutionLengthURL)

  return {
    waterFeatureAnswer,
    lessThan10MetersAnswer,
    pollutionLengthAnswer
  }
}

// Get answers for 'About the pollution' section
const getAboutThePollution = (request) => {
  // Get answer for 'When did you see the pollution?' question
  const whenUrl = 'WATER_POLLUTION_WHEN'
  const whenAnswer = request.yar.get(constants.redisKeys[whenUrl])
  let whenAnswerData
  const pollutionDateAndTime = new Date(whenAnswer)

  if (whenAnswer !== null && whenAnswer) {
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
      minute: '2-digit'
    })

    if (isToday) {
      whenAnswerData = 'Today at ' + pollutionTime
    } else if (isYesterday) {
      whenAnswerData = 'Yesterday at ' + pollutionTime
    } else {
      const dateObj = new Date(pollutionDateAndTime)
      const day = dateObj.getDate()
      const month = dateObj.toLocaleString('default', { month: 'long' })
      const year = dateObj.getFullYear()

      const nthNumber = (number) => {
        if (number > 3 && number < 21) return 'th'
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
      whenAnswerData = pollutionDate + ' at ' + pollutionTime
    }
  }

  // Get answer for 'What do you think the pollution is?' question
  const pollutionSubstanceUrl = 'WATER_POLLUTION_POLLUTION_SUBSTANCE'
  const pollutionSubstanceAnswer = getData(request, pollutionSubstanceUrl)
  let pollutionSubstanceAnswerData

  if (pollutionSubstanceAnswer !== null && pollutionSubstanceAnswer.otherDetails) {
    const joinData = pollutionSubstanceAnswer.answerText.join('<br>')
    pollutionSubstanceAnswerData = joinData + ' - ' + pollutionSubstanceAnswer.otherDetails
  } else if (pollutionSubstanceAnswer.answerText) {
    pollutionSubstanceAnswerData = pollutionSubstanceAnswer.answerText.join('<br>')
  } else {
    pollutionSubstanceAnswerData = pollutionSubstanceAnswer
  }

  // get answer for 'What does the pollution look like?' question
  const pollutionAppearanceUrl = 'WATER_POLLUTION_POLLUTION_APPEARANCE'
  const pollutionAppearanceAnswer = getData(request, pollutionAppearanceUrl)
  let pollutionAppearanceAnswerData

  if (pollutionAppearanceAnswer !== null && pollutionAppearanceAnswer.otherDetails) {
    const joinData = pollutionAppearanceAnswer.answerText.join('<br>')
    pollutionAppearanceAnswerData = joinData + ' - ' + pollutionAppearanceAnswer.otherDetails
  } else if (pollutionAppearanceAnswer.answerText) {
    pollutionAppearanceAnswerData = pollutionAppearanceAnswer.answerText.join('<br>')
  } else {
    pollutionAppearanceAnswerData = pollutionAppearanceAnswer
  }

  // Get answer for 'Do you know where the pollution is coming from?' question
  const pollutionSourceUrl = 'WATER_POLLUTION_SOURCE'
  const pollutionSourceAnswer = getData(request, pollutionSourceUrl)
  let pollutionSourceAnswerData

  if (pollutionSourceAnswer !== null && pollutionSourceAnswer.otherDetails) {
    const joinData = pollutionSourceAnswer.answerText.join('<br>')
    pollutionSourceAnswerData = joinData + ' - ' + pollutionSourceAnswer.otherDetails
  } else {
    pollutionSourceAnswerData = pollutionSourceAnswer
  }

  // Get answer for 'Have you seen any dead fish or animals?' question
  const effectOnWildlifeUrl = 'WATER_POLLUTION_EFFECT_ON_WILDLIFE'
  const effectOnWildlifeAnswer = getData(request, effectOnWildlifeUrl)
  let effectOnWildlifeAnswerData

  if (effectOnWildlifeAnswer !== null && effectOnWildlifeAnswer.otherDetails) {
    const joinData = effectOnWildlifeAnswer.answerText.join('<br>')
    effectOnWildlifeAnswerData = joinData + ' - ' + effectOnWildlifeAnswer.otherDetails
  } else {
    effectOnWildlifeAnswerData = effectOnWildlifeAnswer
  }

  // Get answer for 'Is there anything else you'd like to add?' question
  const otherInformationUrl = 'WATER_POLLUTION_OTHER_INFORMATION'
  const otherInformationAnswer = request.yar.get(constants.redisKeys[otherInformationUrl])
  let otherInformationAnswerData

  if (otherInformationAnswer !== null && otherInformationAnswer.otherInfo) {
    otherInformationAnswerData = otherInformationAnswer.otherInfo
  }

  return {
    whenAnswerData,
    pollutionSubstanceAnswerData,
    pollutionAppearanceAnswerData,
    pollutionSourceAnswerData,
    effectOnWildlifeAnswerData,
    otherInformationAnswerData
  }
}

// Get data and construct answers for the questions
const getData = (request, pageUrl) => {
  const recordedAnswer = request.yar.get(constants.redisKeys[pageUrl])

  if (recordedAnswer !== null && recordedAnswer.length === 1) {
    const selectedAnswerId = recordedAnswer[0].answerId
    const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
    const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
    const answerText = filterAnswer[0].shortText
    return answerText
  } else if (recordedAnswer !== null && recordedAnswer.length > 1) {
    const multiAnswerSet = []
    let otherDetailsData

    for (let i = 0; i < recordedAnswer.length; i++) {
      const selectedAnswerId = recordedAnswer[i].answerId
      const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
      const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
      const answerText = filterAnswer[0].shortText
      if (answerText) {
        multiAnswerSet.push(answerText)
      }
      if (recordedAnswer[i].otherDetails) {
        otherDetailsData = recordedAnswer[i].otherDetails
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

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  }
]
