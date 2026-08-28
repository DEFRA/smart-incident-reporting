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
      await submitGetRequest({ url }, question.text)
    })
    it(`Should return success response and correct view for ${url} with prior entered values`, async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId" name="answerId" type="checkbox" value="1701" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-2" name="answerId" type="checkbox" value="1702" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-6" name="answerId" type="checkbox" value="1706" checked')
      expect(response.payload).toContain('value="test details">')
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
      expect(response.payload).toContain('Select the description of the smell')
      expect(response.request.yar.get(question.key)).toEqual([])
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

    it('Should accept multiple selected answers and store each as a separate answer', async () => {
      const options = {
        url,
        payload: {
          answerId: [
            question.answers.sewage.answerId.toString(),
            question.answers.burningOrSmoke.answerId.toString()
          ]
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_RECURRING)
      expect(response.request.yar.get(question.key)).toEqual([
        { ...baseAnswer, answerId: question.answers.sewage.answerId },
        { ...baseAnswer, answerId: question.answers.burningOrSmoke.answerId }
      ])
    })

    it('Should store additional details when something else selected with details provided', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.somethingElse.answerId.toString(),
          somethingElseDetails: 'A strange chemical smell'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_RECURRING)
      expect(response.request.yar.get(question.key)).toEqual([
        { ...baseAnswer, answerId: question.answers.somethingElse.answerId },
        { ...baseAnswer, answerId: question.answers.somethingElseDetails.answerId, otherDetails: 'A strange chemical smell' }
      ])
    })

    it('Should not store additional details when something else selected but no details provided', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.somethingElse.answerId.toString()
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_RECURRING)
      expect(response.request.yar.get(question.key)).toEqual([
        { ...baseAnswer, answerId: question.answers.somethingElse.answerId }
      ])
    })
  })
})
