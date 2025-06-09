import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_IMAGES_OR_VIDEO
const question = questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionDataWithEmail = {
  'smell/contact-details': {
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithoutEmail = {
  'smell/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  }
}

const sessionDataYes = {
  'smell/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'smell/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
}
const sessionDataNo = {
  'smell/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'smell/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.no.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataWithEmail)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
    })
    it(`Should return success response and correct view for ${url} with email text field`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataWithoutEmail)
      expect(response.payload).toContain('We need your email to send you instructions on how to share images and videos, after you send your report.')
      expect(response.payload).toContain('Email address')
    })
    it(`Should return success response and correct view for ${url} with pre selected yes option`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataYes)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
      expect(response.payload).toContain('value="3501" checked')
    })
    it(`Should return success response and correct view for ${url} with pre selected no option`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataNo)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
      expect(response.payload).toContain('value="3502" checked')
    })
  })
  describe('POST', () => {
    it('Happy: Should accept yes option with prefilled data and redirect to SMELL_OTHER_INFORMATION', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.SMELL_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: Should accept yes option with text input data and redirect to SMELL_OTHER_INFORMATION', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId,
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithoutEmail)
      expect(response.headers.location).toEqual(constants.routes.SMELL_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
      expect(response.request.yar.get(constants.redisKeys.SMELL_CONTACT_DETAILS)).toEqual({
        reporterName: 'test name',
        reporterPhoneNumber: '012345678910',
        reporterEmailAddress: 'test@test.com'
      })
    })
    it('Happy: Should accept no option with email data and redirect to SMELL_OTHER_INFORMATION', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.SMELL_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: Should accept no option without email data and redirect to SMELL_OTHER_INFORMATION', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithoutEmail)
      expect(response.headers.location).toEqual(constants.routes.SMELL_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithEmail)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if you want to send us any images or videos')
    })
    it('Sad: Should error for an empty email address', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const sessionData3 = {
        'smell/contact-details': {
          reporterEmailAddress: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData3)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter an email address')
    })
    it('Sad: Should error for an invalid email address', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId,
          email: 'sdfdsf'
        }
      }
      const sessionData4 = {
        'smell/contact-details': {
          reporterEmailAddress: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData4)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter an email address in the correct format, like name@example.com')
    })
  })
})
