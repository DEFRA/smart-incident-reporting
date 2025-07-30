import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_ROD_LICENCE
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ROD_LICENCE
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.noRodLicenceDetails.answerId
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a no rod licence description', async () => {
      const noRodLicenceDescription = 'This is a description for no rod licence'
      const options = {
        url,
        payload: {
          noRodLicenceDescription
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ROD_LICENCE)).toEqual([{
        ...baseAnswer,
        otherDetails: noRodLicenceDescription
      }])
    })
    it('Sad: errors on no noRodLicenceDescription provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter how you know the people fishing do not have a rod licence')
    })
  })
})
