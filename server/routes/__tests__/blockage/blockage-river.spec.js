import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_RIVER
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_IN_RIVER
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/river': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.noOtherWater.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Is the blockage in a river?')
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Is the blockage in a river?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="100003" checked>')
    })
  })
  describe('POST', () => {
     it('Should accept yes option and redirect to blockage/river-name', async () => {
       const answerId = question.answers.yes.answerId
       const options = {
         url,
         payload: {
           answerId
         }
       }
       const response = await submitPostRequest(options)
       console.log(baseAnswer)
       console.log(answerId)
       expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_RIVER_NAME)
       expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)).toEqual([{
         ...baseAnswer,
         answerId
       }])
     })
    it('Should accept you are not sure option and redirect to blockage/report-local-council', async () => {
       const answerId = question.answers.youAreNotSure.answerId
       const options = {
         url,
         payload: {
           answerId
         }
       }
       const response = await submitPostRequest(options)
       expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_REPORT_LOCAL_COUNCIL)
       expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)).toEqual([{
         ...baseAnswer,
         answerId
       }])
     })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Answer yes if the blockage is in a river')
    })
  })
})
