import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.BLOCKAGE_FLOOD_RISK_DANGER
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_FLOOD_RISK_DANGER
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/flood-risk-danger': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yourHome.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.yourOtherProperty.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElse.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElseDetail.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
    it(`Should return success response and correct view for ${url} with prior entered values`, async () => {
      const response = await submitGetRequest({ url }, baseAnswer.questionAsked, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId" name="answerId" type="checkbox" value="161" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-2" name="answerId" type="checkbox" value="162" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-8" name="answerId" type="checkbox" value="168" checked')
      expect(response.payload).toContain('value="test details">')
    })
  })

  describe('POST', () => {
    it.each([
      {
        description: 'no selection',
        payload: {},
        expectedErrors: ['Select what is at risk from flooding or &#39;you do not know&#39;'],
        shouldPreserveCheckboxes: false
      },
      {
        description: 'commercial property selected but no details provided',
        payload: {
          answerId: question.answers.commercialProperty.answerId.toString(),
          commercialPropertyDetail: ''
        },
        expectedErrors: ['Enter details about the type of buildings at risk from flooding'],
        shouldPreserveCheckboxes: true
      },
      {
        description: 'something else selected but no details provided',
        payload: {
          answerId: question.answers.somethingElse.answerId.toString(),
          somethingElseDetail: ''
        },
        expectedErrors: ['Enter details about what is at risk from flooding'],
        shouldPreserveCheckboxes: true
      },
      {
        description: 'commercial property with no details and other peoples homes',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.otherPeopleHome.answerId.toString()],
          commercialPropertyDetail: ''
        },
        expectedErrors: ['Enter details about the type of buildings at risk from flooding'],
        shouldPreserveCheckboxes: true
      },
      {
        description: 'something else with no details and farmland',
        payload: {
          answerId: [question.answers.somethingElse.answerId.toString(), question.answers.farmland.answerId.toString()],
          somethingElseDetail: ''
        },
        expectedErrors: ['Enter details about what is at risk from flooding'],
        shouldPreserveCheckboxes: true
      },
      {
        description: 'commercial property with no details and something else with no details',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.somethingElse.answerId.toString()],
          commercialPropertyDetail: '',
          somethingElseDetail: ''
        },
        expectedErrors: [
          'Enter details about the type of buildings at risk from flooding',
          'Enter details about what is at risk from flooding'
        ],
        shouldPreserveCheckboxes: true
      },
      {
        description: 'commercial property with details but something else with no details',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.somethingElse.answerId.toString()],
          commercialPropertyDetail: 'Shop details',
          somethingElseDetail: ''
        },
        expectedErrors: ['Enter details about what is at risk from flooding'],
        shouldPreserveCheckboxes: true,
        shouldPreserveCommercialDetails: true
      },
      {
        description: 'commercial property with no details but something else with details',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.somethingElse.answerId.toString()],
          commercialPropertyDetail: '',
          somethingElseDetail: 'Something else details'
        },
        expectedErrors: ['Enter details about the type of buildings at risk from flooding'],
        shouldPreserveCheckboxes: true,
        shouldPreserveSomethingElseDetails: true
      }
    ])('Should return error and preserve selections when $description', async ({ payload, expectedErrors, shouldPreserveCheckboxes, shouldPreserveCommercialDetails, shouldPreserveSomethingElseDetails }) => {
      const options = {
        url,
        payload
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expectedErrors.forEach(error => {
        expect(response.payload).toContain(error)
      })
      if (shouldPreserveCheckboxes) {
        const answerIds = Array.isArray(payload.answerId) ? payload.answerId : [payload.answerId]
        answerIds.forEach(id => {
          expect(response.payload).toContain(`value="${id}" checked`)
        })
      }
      if (shouldPreserveCommercialDetails) {
        expect(response.payload).toContain(`value="${payload.commercialPropertyDetail}"`)
      }
      if (shouldPreserveSomethingElseDetails) {
        expect(response.payload).toContain(`value="${payload.somethingElseDetail}"`)
      }
    })

    it.each([
      {
        description: 'animals',
        payload: {
          answerId: question.answers.animal.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.animal.answerId }
        ]
      },
      {
        description: 'farmland',
        payload: {
          answerId: question.answers.farmland.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.farmland.answerId }
        ]
      },
      {
        description: 'roads railways powerlines or similar',
        payload: {
          answerId: question.answers.road.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.road.answerId }
        ]
      },
      {
        description: 'you do not know',
        payload: {
          answerId: question.answers.unknown.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.unknown.answerId }
        ]
      },
      {
        description: 'other peoples homes',
        payload: {
          answerId: question.answers.otherPeopleHome.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.otherPeopleHome.answerId }
        ]
      },
      {
        description: 'your home',
        payload: {
          answerId: question.answers.yourHome.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.yourHome.answerId }
        ]
      },
      {
        description: 'your other property',
        payload: {
          answerId: question.answers.yourOtherProperty.answerId.toString()
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.yourOtherProperty.answerId }
        ]
      },
      {
        description: 'commercial property with details and something else with details',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.somethingElse.answerId.toString()],
          commercialPropertyDetail: 'Shop and office',
          somethingElseDetail: 'Park nearby'
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.commercialProperty.answerId },
          { ...baseAnswer, answerId: question.answers.somethingElse.answerId },
          { ...baseAnswer, answerId: question.answers.somethingElseDetail.answerId, otherDetails: 'Park nearby' },
          { ...baseAnswer, answerId: question.answers.commercialPropertyDetail.answerId, otherDetails: 'Shop and office' }
        ]
      },
      {
        description: 'commercial property with details and other peoples homes',
        payload: {
          answerId: [question.answers.commercialProperty.answerId.toString(), question.answers.otherPeopleHome.answerId.toString()],
          commercialPropertyDetail: 'Factory building'
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.commercialProperty.answerId },
          { ...baseAnswer, answerId: question.answers.otherPeopleHome.answerId },
          { ...baseAnswer, answerId: question.answers.commercialPropertyDetail.answerId, otherDetails: 'Factory building' }
        ]
      },
      {
        description: 'something else with details and farmland',
        payload: {
          answerId: [question.answers.somethingElse.answerId.toString(), question.answers.farmland.answerId.toString()],
          somethingElseDetail: 'Bridge structure'
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.somethingElse.answerId },
          { ...baseAnswer, answerId: question.answers.farmland.answerId },
          { ...baseAnswer, answerId: question.answers.somethingElseDetail.answerId, otherDetails: 'Bridge structure' }
        ]
      },
      {
        description: 'your home, other peoples homes and roads',
        payload: {
          answerId: [
            question.answers.yourHome.answerId.toString(),
            question.answers.otherPeopleHome.answerId.toString(),
            question.answers.road.answerId.toString()
          ]
        },
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.yourHome.answerId },
          { ...baseAnswer, answerId: question.answers.otherPeopleHome.answerId },
          { ...baseAnswer, answerId: question.answers.road.answerId }
        ]
      }
    ])('Should accept valid answers and redirect when $description', async ({ payload, expectedAnswers }) => {
      const options = {
        url,
        payload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_OWNER)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_FLOOD_RISK_DANGER)).toEqual(expectedAnswers)
    })
  })
})
