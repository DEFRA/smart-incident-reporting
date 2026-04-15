import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const videoAnswerId = (question.answers.video || question.answers.videos).answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionDataWithEmail = {
  'water-pollution/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithoutEmail = {
  'water-pollution/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  }
}

const sessionDataWithPhotosSelected = {
  'water-pollution/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.photos.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
}

const sessionDataNo = {
  'water-pollution/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.no.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithEmail)
    })

    it(`Should return success response and correct view for ${url} with empty contact email`, async () => {
      await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithoutEmail)
    })

    it(`Should return success response and show selected photos option for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithPhotosSelected)
      expect(response.payload).toContain(`value="${question.answers.photos.answerId}" checked`)
    })

    it(`Should return success response and show selected no option for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataNo)
      expect(response.payload).toContain(`value="${question.answers.no.answerId}" checked`)
    })
  })

  describe('POST', () => {
    it('Happy: accepts photos and saves photos + yes answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.photos.answerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.photos.answerId
      }])
    })

    it('Happy: accepts video and saves video + yes answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: videoAnswerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: videoAnswerId
      }])
    })

    it('Happy: accepts photos and video and saves both + yes answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: [question.answers.photos.answerId.toString(), videoAnswerId.toString()]
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.photos.answerId
      }, {
        ...baseAnswer,
        answerId: videoAnswerId
      }])
    })

    it('Happy: accepts no and saves only no answer ID', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithoutEmail)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })

    it('Happy: redirects to referer when set', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.photos.answerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'water-pollution/contact-details': {
          reporterEmailAddress: 'test@test.com'
        },
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })

      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.photos.answerId
      }])
    })

    it('Sad: no checkbox selected returns error state', async () => {
      const options = {
        url,
        payload: {}
      }

      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithEmail)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select &#39;yes&#39; if you want to send us any images or videos')
    })
  })
})
