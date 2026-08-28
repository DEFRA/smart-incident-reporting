import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_DESCRIPTION
const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_DESCRIPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it('Should return error when no selection made', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you would describe the smell')
    })

    it.each([
      {
        description: 'sewage',
        answerId: question.answers.sewage.answerId
      },
      {
        description: 'rubbish or refuse',
        answerId: question.answers.rubbishOrRefuse.answerId
      },
      {
        description: 'burning or smoke',
        answerId: question.answers.burningOrSmoke.answerId
      },
      {
        description: 'gas or petrol',
        answerId: question.answers.gasOrPetrol.answerId
      },
      {
        description: 'agriculture',
        answerId: question.answers.agriculture.answerId
      },
      {
        description: 'something else',
        answerId: question.answers.somethingElse.answerId
      },
      {
        description: 'cannot describe it',
        answerId: question.answers.cannotDescribe.answerId
      }
    ])('Should accept valid answer and redirect to smell recurring when $description', async ({ answerId }) => {
      const options = {
        url,
        payload: { answerId: answerId.toString() }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_RECURRING)
      expect(response.request.yar.get(question.key)).toEqual([
        { ...baseAnswer, answerId }
      ])
    })
  })
})
