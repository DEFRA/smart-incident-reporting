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

const getYourDetails = (request) => {
  const { reporterName, reporterPhoneNumber, reporterEmailAddress } = request.yar.get(constants.redisKeys.HOME)

  const imagesOrVideosUrl = 'WATER_POLLUTION_IMAGES_OR_VIDEO'
  const imagesOrVideosAnswer = getData(request, imagesOrVideosUrl)

  return {
    reporterName,
    reporterPhoneNumber,
    reporterEmailAddress,
    imagesOrVideosAnswer
  }
}

const getLocationAndSizeOfPollution = (request) => {
  const typeOfWaterUrl = 'WATER_POLLUTION_WATER_FEATURE'
  const typeOfWaterAnswer = getData(request, typeOfWaterUrl)

  const lessThan10MetersUrl = 'WATER_POLLUTION_LESS_THAN_10_METRES'
  const lessThan10MetersAnswer = getData(request, lessThan10MetersUrl)

  const sizeOfPollutionURL = 'WATER_POLLUTION_POLLUTION_LENGTH'
  const sizeOfPollutionAnswer = getData(request, sizeOfPollutionURL)

  return {
    typeOfWaterAnswer,
    lessThan10MetersAnswer,
    sizeOfPollutionAnswer
  }
}

const getAboutThePollution = (request) => {
  const whenUrl = 'WATER_POLLUTION_WHEN'
  const whenAnswer = request.yar.get(constants.redisKeys[whenUrl])
  let whenAnswerData

  const pollutionDateAndTime = new Date(whenAnswer)

  if (whenAnswer !== null && whenAnswer) {

    const checkIfToday = () => {
      const today = new Date()
      return pollutionDateAndTime.getDate() == today.getDate() &&
        pollutionDateAndTime.getMonth() == today.getMonth() &&
        pollutionDateAndTime.getFullYear() == today.getFullYear()
    }

    const checkIfYesterday = () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return pollutionDateAndTime.getDate() == yesterday.getDate() &&
        pollutionDateAndTime.getMonth() == yesterday.getMonth() &&
        pollutionDateAndTime.getFullYear() == yesterday.getFullYear()
    }

    console.log("Data for isYesterday", checkIfYesterday())
    console.log("Data for isToday", checkIfToday())

    const isToday = checkIfToday()
    const isYesterday = checkIfYesterday()

    const date = new Date(pollutionDateAndTime)
    let pollutionTime = date.toLocaleString([], {
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
      const month = dateObj.toLocaleString("default", { month: "long" })
      const year = dateObj.getFullYear()

      const nthNumber = (number) => {
        if (number > 3 && number < 21) return "th";
        switch (number % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }

      const pollutionDate = `${day}${nthNumber(day)} ${month} ${year}`;
      whenAnswerData = pollutionDate + ' at ' + pollutionTime
    }
  }

  console.log("Data for whenAnswer", whenAnswer)
  console.log("Data for pollutionDateAndTime", pollutionDateAndTime)

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

  const pollutionSourceUrl = 'WATER_POLLUTION_SOURCE'
  const pollutionSourceAnswer = getData(request, pollutionSourceUrl)
  let pollutionSourceAnswerData

  if (pollutionSourceAnswer !== null && pollutionSourceAnswer.otherDetails) {
    const joinData = pollutionSourceAnswer.answerText.join('<br>')
    pollutionSourceAnswerData = joinData + ' - ' + pollutionSourceAnswer.otherDetails
  } else {
    pollutionSourceAnswerData = pollutionSourceAnswer
  }

  const effectOnWildlifeUrl = 'WATER_POLLUTION_EFFECT_ON_WILDLIFE'
  const effectOnWildlifeAnswer = getData(request, effectOnWildlifeUrl)
  let effectOnWildlifeAnswerData

  if (effectOnWildlifeAnswer !== null && effectOnWildlifeAnswer.otherDetails) {
    const joinData = effectOnWildlifeAnswer.answerText.join('<br>')
    effectOnWildlifeAnswerData = joinData + ' - ' + effectOnWildlifeAnswer.otherDetails
  } else {
    effectOnWildlifeAnswerData = effectOnWildlifeAnswer
  }

  const otherInformationUrl = 'WATER_POLLUTION_EFFECT_ON_WILDLIFE'
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

const getData = (request, pageUrl) => {
  const recordedAnswer = request.yar.get(constants.redisKeys[pageUrl])

  if (recordedAnswer !== null && recordedAnswer.length === 1) {
    const selectedAnswerId = recordedAnswer[0].answerId
    const answerSet = Object.values(questionSets.WATER_POLLUTION.questions[pageUrl].answers)
    const filterAnswer = answerSet.filter(item => item.answerId === selectedAnswerId)
    const answerText = filterAnswer[0].shortText

    return answerText

  } else if (recordedAnswer !== null && recordedAnswer.length > 1) {
    let multiAnswerSet = []
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
