import constants from './constants.js'
import { questionSets } from '../utils/question-sets.js'

function populateSession (session) {
  session.reset()
  session.set(constants.redisKeys.QUESTION_SET_ID, questionSets.WATER_POLLUTION.questionSetId)

  const date = new Date()
  date.setHours(date.getHours() - 2)

  session.set(constants.redisKeys.WATER_POLLUTION_WHEN, date.toISOString())
  session.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, 'Nothing really')
  session.set(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS, {
    reporterName: 'Paul Andrews',
    reporterPhoneNumber: '',
    reporterEmailAddress: 'paul.andrews@defra.gov.uk'
  })

  session.set(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE, [
    {
      questionId: 500,
      questionAsked: 'In what kind of water is the pollution?',
      questionResponse: true,
      answerId: 501
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES, [
    {
      questionId: 700,
      questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
      questionResponse: true,
      answerId: 702
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH, [
    {
      questionId: 400,
      questionAsked: 'How far along the water feature does the pollution spread?',
      questionResponse: true,
      answerId: 401
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE, [
    {
      questionId: 1000,
      questionAsked: 'What does the pollution look like?',
      questionResponse: true,
      answerId: 1001
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_SOURCE, [
    {
      questionId: 100,
      questionAsked: 'Do you know where the pollution is coming from?',
      questionResponse: true,
      answerId: 102
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, [
    {
      questionId: 2800,
      questionAsked: 'Do you want to send us any images or videos of the pollution?',
      questionResponse: true,
      answerId: 2801
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_LOCATION_OPTION, [
    {
      questionId: 2600,
      questionAsked: 'Where did you see the pollution?',
      questionResponse: true,
      answerId: 2601
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION, [
    {
      questionId: 900,
      questionAsked: 'Where is the pollution?',
      questionResponse: true,
      answerId: 901,
      otherDetails: '///tweeted.saga.sway'
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE, [
    {
      questionId: 200,
      questionAsked: 'Have you seen any dead or distressed fish or animals nearby?',
      questionResponse: true,
      answerId: 202
    }
  ])

  session.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE, [
    {
      questionId: 2900,
      questionAsked: 'What do you think the pollution is?',
      questionResponse: true,
      answerId: 2902
    }
  ])
}

export {
  populateSession
}
