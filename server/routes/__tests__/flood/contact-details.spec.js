import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'
const url = constants.routes.FLOOD_CONTACT_DETAILS
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailFormatError = 'Enter an email address in the correct format, like name@example.com'
const emailRequiredError = 'Enter an email address'
const imagesQuestion = questionSets.FLOOD.questions.FLOOD_IMAGES_OR_VIDEO

const sessionData = {
  'flood/contact-details': {
    reporterName: 'test name',
    reporterPhone: '012345678910',
    reporterEmail: 'test@test.com'
  }
}

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view', async () => {
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="test name"')
      expect(response.result).toContain('value="012345678910"')
      expect(response.result).toContain('value="test@test.com"')
    })

    it('Should display contact-details view with empty values when no answers stored', async () => {
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK)
      expect(response.result).toContain('Email address (optional)')
    })

    it('Should display email as mandatory when photos are selected in images-or-video', async () => {
      const sessionDataWithImages = {
        [constants.redisKeys.FLOOD_IMAGES_OR_VIDEO]: [
          { answerId: imagesQuestion.answers.yesPhotos.answerId }
        ]
      }
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionDataWithImages)
      expect(response.result).toContain('You need to give an email to include photos or video with your report')
    })

    it('Should display email as optional when video is not selected in images-or-video', async () => {
      const sessionDataWithImages = {
        [constants.redisKeys.FLOOD_IMAGES_OR_VIDEO]: [
          { answerId: imagesQuestion.answers.noVideo.answerId }
        ]
      }
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionDataWithImages)
      expect(response.result).toContain('Email address (optional)')
    })
  })

  describe('POST', () => {
    it('Happy: Accepts valid answers and redirects to the next page', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual('/next-page')
      expect(response.request.yar.get(constants.redisKeys.FLOOD_CONTACT_DETAILS)).toEqual({
        reporterName: 'John Smith',
        reporterPhone: '#+441234567890',
        reporterEmail: 'test@test.com'
      })
    })

    it('Happy: Accepts empty optional contact details', async () => {
      const options = {
        url,
        payload: {
          fullName: '',
          phone: '',
          email: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
      expect(response.headers.location).toEqual('/next-page')
      expect(response.request.yar.get(constants.redisKeys.FLOOD_CONTACT_DETAILS)).toEqual({
        reporterName: '',
        reporterPhone: '',
        reporterEmail: ''
      })
    })

    it('Happy: Accepts an email when video is selected in images-or-video', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: 'test@test.com'
        }
      }
      const sessionDataWithVideo = {
        [constants.redisKeys.FLOOD_IMAGES_OR_VIDEO]: [
          { answerId: imagesQuestion.answers.yesVideo.answerId }
        ]
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithVideo)
      expect(response.headers.location).toEqual('/next-page')
    })

    it('Happy: Should not require email when no photos are selected in images-or-video', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: ''
        }
      }
      const sessionDataWithImages = {
        [constants.redisKeys.FLOOD_IMAGES_OR_VIDEO]: [
          { answerId: imagesQuestion.answers.noPhotos.answerId }
        ]
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithImages)
      expect(response.headers.location).toEqual('/next-page')
    })

    it('Sad: Should error if invalid phone number', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: 'sdfsrt',
          email: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(phoneError)
    })

    it('Sad: Should error if invalid email address', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: 'sdfdsf'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(emailFormatError)
    })

    it('Sad: Should require email when photos are selected in images-or-video', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: ''
        }
      }
      const sessionDataWithImages = {
        [constants.redisKeys.FLOOD_IMAGES_OR_VIDEO]: [
          { answerId: imagesQuestion.answers.yesPhotos.answerId }
        ]
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithImages)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(emailRequiredError)
    })
  })
})
