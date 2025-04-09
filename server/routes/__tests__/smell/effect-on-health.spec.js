import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_EFFECT_ON_HEALTH
const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_HEALTH
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, baseAnswer.questionAsked)
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to SMELL_MEDICAL_HELP', async () => {
      const answerId = question.answers.headache.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_MEDICAL_HELP)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_HEALTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.headache.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to SMELL_MEDICAL_HELP', async () => {
      const answerId = [question.answers.headache.answerId.toString(), question.answers.wateringEyes.answerId.toString(), question.answers.sicknessOrNausea.answerId.toString(), question.answers.vomiting.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_MEDICAL_HELP)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_HEALTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.headache.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.wateringEyes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.sicknessOrNausea.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.vomiting.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to SMELL_MEDICAL_HELP', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetails: 'Something else details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_MEDICAL_HELP)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_HEALTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: 'Something else details'
      }])
    })
    it('Happy: accepts valiid answerId none of these and redirects to SMELL_CONTACT', async () => {
      const answerId = question.answers.noneOfthese.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CONTACT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_HEALTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.noneOfthese.answerId
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select any health conditions caused by the smell, or &#39;none of these&#39;')
    })
  })
})
