import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/smell-server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_DESCRIPTION
const question = questionSets.SMELL.questions.SMELL_DESCRIPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'smell/description': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.sewage.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.rubbishOrRefuse.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElse.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElseDetails.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, baseAnswer.questionAsked)
    })
    it(`Should return success response and correct view for ${url} with prior entered values`, async () => {
      const response = await submitGetRequest({ url }, baseAnswer.questionAsked, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId" name="answerId" type="checkbox" value="1701" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-2" name="answerId" type="checkbox" value="1702" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-6" name="answerId" type="checkbox" value="1706" checked')
      expect(response.payload).toContain('value="test details">')
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to SMELL_PREVIOUS', async () => {
      const answerId = question.answers.sewage.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to SMELL_PREVIOUS', async () => {
      const answerId = [question.answers.sewage.answerId.toString(), question.answers.gasOrPetrol.answerId.toString(), question.answers.agriculture.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.gasOrPetrol.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.agriculture.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to SMELL_PREVIOUS', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetails: 'something else'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: 'something else'
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select the description of the smell')
    })
  })
})
