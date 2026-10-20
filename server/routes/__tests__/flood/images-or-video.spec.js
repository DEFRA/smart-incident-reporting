import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_IMAGES_OR_VIDEO
const question = questionSets.FLOOD.questions.FLOOD_IMAGES_OR_VIDEO
const yesPhotosAnswerId = question.answers.yesPhotos.answerId
const noPhotosAnswerId = question.answers.noPhotos.answerId
const yesVideoAnswerId = question.answers.yesVideo.answerId
const noVideoAnswerId = question.answers.noVideo.answerId

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionDataWithEmail = {
  'flood/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@example.com'
  }
}

const sessionDataWithoutEmail = {
  'flood/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  }
}

const sessionDataWithPhotosSelected = {
  ...sessionDataWithEmail,
  [question.key]: [
    { ...baseAnswer, answerId: yesPhotosAnswerId },
    { ...baseAnswer, answerId: noVideoAnswerId }
  ]
}

const sessionDataNo = {
  ...sessionDataWithEmail,
  [question.key]: [
    { ...baseAnswer, answerId: noPhotosAnswerId },
    { ...baseAnswer, answerId: noVideoAnswerId }
  ]
}

describe(url, () => {
  describe('GET', () => {
    it('Should return success response and correct view', async () => {
      await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionDataWithEmail)
    })

    it('Should return success response with empty contact email', async () => {
      await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionDataWithoutEmail)
    })

    it('Should show the selected photos option', async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionDataWithPhotosSelected)
      expect(response.payload).toContain(`value="${yesPhotosAnswerId}" checked`)
    })

    it('Should show the selected no option', async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionDataNo)
      expect(response.payload).toContain(`value="${noPhotosAnswerId}" checked`)
    })
  })

  describe('POST', () => {
    it('Happy: accepts photos and saves yesPhotos + noVideo answer IDs', async () => {
      const options = {
        url,
        payload: { answerId: String(yesPhotosAnswerId) }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)

      expect(response.headers.location).toEqual(constants.routes.FLOOD_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_IMAGES_OR_VIDEO)).toEqual([
        { ...baseAnswer, answerId: yesPhotosAnswerId },
        { ...baseAnswer, answerId: noVideoAnswerId }
      ])
    })

    it('Happy: accepts video and saves noPhotos + yesVideo answer IDs', async () => {
      const options = {
        url,
        payload: { answerId: String(yesVideoAnswerId) }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)

      expect(response.headers.location).toEqual(constants.routes.FLOOD_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_IMAGES_OR_VIDEO)).toEqual([
        { ...baseAnswer, answerId: noPhotosAnswerId },
        { ...baseAnswer, answerId: yesVideoAnswerId }
      ])
    })

    it('Happy: accepts photos and video and saves yesPhotos + yesVideo answer IDs', async () => {
      const options = {
        url,
        payload: { answerId: [String(yesPhotosAnswerId), String(yesVideoAnswerId)] }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithEmail)

      expect(response.headers.location).toEqual(constants.routes.FLOOD_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_IMAGES_OR_VIDEO)).toEqual([
        { ...baseAnswer, answerId: yesPhotosAnswerId },
        { ...baseAnswer, answerId: yesVideoAnswerId }
      ])
    })

    it('Happy: accepts no and saves noPhotos + noVideo answer IDs', async () => {
      const options = {
        url,
        payload: { answerId: String(noPhotosAnswerId) }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithoutEmail)

      expect(response.headers.location).toEqual(constants.routes.FLOOD_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_IMAGES_OR_VIDEO)).toEqual([
        { ...baseAnswer, answerId: noPhotosAnswerId },
        { ...baseAnswer, answerId: noVideoAnswerId }
      ])
    })

    it.each([
      ['no checkbox selected', {}],
      ['invalid answer ID', { answerId: '999999' }]
    ])('Sad: %s returns an error and clears selected options', async (_label, payload) => {
      const response = await submitPostRequest(
        { url, payload },
        constants.statusCodes.OK,
        sessionDataWithPhotosSelected
      )

      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select whether you have any photos or videos to include')
      expect(response.payload).not.toContain(`value="${yesPhotosAnswerId}" checked`)
      expect(response.request.yar.get(question.key)).toEqual([])
    })
  })
})
