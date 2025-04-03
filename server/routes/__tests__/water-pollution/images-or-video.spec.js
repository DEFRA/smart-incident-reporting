import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const contactQuestion = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_CONTACT

let sessionData = {
  'water-pollution/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/contact': [{
    questionId: contactQuestion.questionId,
    answerId: contactQuestion.answers.yes.answerId
  }]
}

const sessionDataWithAnswer = {
  'water-pollution/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/contact': [{
    questionId: contactQuestion.questionId,
    answerId: contactQuestion.answers.yes.answerId
  }],
  'water-pollution/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
}

const sessionDataWithYes = {
  'water-pollution/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/contact': [{
    questionId: contactQuestion.questionId,
    answerId: contactQuestion.answers.yes.answerId
  }]
}

const sessionDataWithNo = {
  'water-pollution/contact-details': {
    reporterEmailAddress: ''
  },
  'water-pollution/contact': [{
    questionId: contactQuestion.questionId,
    answerId: contactQuestion.answers.no.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
    })
    it(`Should return success response and correct view for ${url} with pre entered data`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithAnswer)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
      expect(response.payload).toContain('value="2801" checked')
    })
    it(`Should return success response and correct view for ${url} with options and pre entered data`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithYes)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
    })
    it(`Should return success response and correct view for ${url} with email text field`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithNo)
      expect(response.payload).toContain('We need your email to send you instructions on how to share images and videos, after you send your report.')
      expect(response.payload).toContain('Email address')
    })
  })
  describe('POST', () => {
    it('Happy: Should accept yes option with prefilled data and redirect to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithYes)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: Should accept yes option with text input data and redirect to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId,
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithNo)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)).toEqual({
        reporterName: '',
        reporterPhoneNumber: '',
        reporterEmailAddress: 'test@test.com'
      })
    })
    it('Happy: Should accept no option and redirect to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithYes)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: Should accept yes option with prefilled data and redirect to WATER_POLLUTION_CHECK_YOUR_ANSWERS', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const answerData = {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if you want to send us any images or videos')
    })
  })
})
