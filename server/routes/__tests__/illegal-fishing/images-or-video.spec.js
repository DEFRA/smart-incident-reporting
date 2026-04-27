import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_IMAGES_OR_VIDEO
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO
const videoAnswerId = question.answers.yesVideo.answerId
const noVideoAnswerId = question.answers.noVideo.answerId
const noPhotosAnswerId = question.answers.noPhotos.answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionDataWithEmail = {
  'illegal-fishing/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithoutEmail = {
  'illegal-fishing/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  }
}

const sessionDataWithPhotosSelected = {
  'illegal-fishing/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'illegal-fishing/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yesPhotos.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: noVideoAnswerId
  }]
}

const sessionDataNo = {
  'illegal-fishing/contact-details': {
    reporterEmailAddress: 'test@test.com'
  },
  'illegal-fishing/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: noPhotosAnswerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: noVideoAnswerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataWithEmail)
    })

    it(`Should return success response and correct view for ${url} with empty contact email`, async () => {
      await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataWithoutEmail)
    })

    it(`Should return success response and show selected photos option for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataWithPhotosSelected)
      expect(response.payload).toContain(`value="${question.answers.yesPhotos.answerId}" checked`)
    })

    it(`Should return success response and show selected no option for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionDataNo)
      expect(response.payload).toContain(`value="${question.answers.noPhotos.answerId}" checked`)
    })
  })

  describe('POST', () => {
    it('Happy: accepts photos and saves yesPhotos + noVideo answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yesPhotos.answerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yesPhotos.answerId
      }, {
        ...baseAnswer,
        answerId: noVideoAnswerId
      }])
    })

    it('Happy: accepts video and saves noPhotos + yesVideo answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: videoAnswerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: noPhotosAnswerId
      }, {
        ...baseAnswer,
        answerId: videoAnswerId
      }])
    })

    it('Happy: accepts photos and video and saves yesPhotos + yesVideo answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: [question.answers.yesPhotos.answerId.toString(), videoAnswerId.toString()]
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yesPhotos.answerId
      }, {
        ...baseAnswer,
        answerId: videoAnswerId
      }])
    })

    it('Happy: accepts no and saves noPhotos + noVideo answer IDs', async () => {
      const options = {
        url,
        payload: {
          answerId: noPhotosAnswerId.toString()
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithoutEmail)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId: noPhotosAnswerId
      }, {
        ...baseAnswer,
        answerId: noVideoAnswerId
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

    it('Sad: no checkbox selected does not re-show previous selected option', async () => {
      const options = {
        url,
        payload: {}
      }

      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithPhotosSelected)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain(`value="${question.answers.yesPhotos.answerId}" checked`)
    })

    it('Sad: invalid non-empty answerId returns error and clears selected options', async () => {
      const options = {
        url,
        payload: {
          answerId: '999999'
        }
      }

      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithPhotosSelected)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select &#39;yes&#39; if you want to send us any images or videos')
      expect(response.payload).not.toContain(`value="${question.answers.yesPhotos.answerId}" checked`)
      expect(response.payload).not.toContain(`value="${question.answers.yesVideo.answerId}" checked`)
      expect(response.payload).not.toContain(`value="${question.answers.noPhotos.answerId}" checked`)
    })
  })
})
