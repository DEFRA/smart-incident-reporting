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
    // update redirectTo
    it.each([
      { answer: 'animal', description: 'Animals, for example cattle or horses', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'farmland', description: 'Farmland or countryside', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'road', description: 'Roads, railways, powerlines or similar', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'unknown', description: 'you dont know', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'otherPeopleHome', description: 'Other people\'s homes', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'yourHome', description: 'Your home or parts of it, including your garage if attached', redirectTo: constants.routes.BLOCKAGE_START },
      { answer: 'yourOtherProperty', description: 'Other property you own, for example your garden, sheds or a detached garage', redirectTo: constants.routes.BLOCKAGE_START }
 ])('Should redirect to blockage/start when $description selected', async ({ answer, redirectTo }) => {
      const answerId = question.answers[answer].answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(redirectTo)
    })
   it('Happy: accepts valid array of answerID and redirects to BLOCKAGE_START', async () => {
      const answerId = [question.answers.yourHome.answerId.toString(), question.answers.yourOtherProperty.answerId.toString(), question.answers.animal.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_FLOOD_RISK_DANGER)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yourHome.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yourOtherProperty.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.animal.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to BLOCKAGE_START', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail: 'something else'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_FLOOD_RISK_DANGER)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: 'something else'
      }])
    })
    it('Happy: accepts valid answers with commercial property and other details and redirects to BLOCKAGE_START', async () => {
      const answerId = question.answers.commercialProperty.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          commercialPropertyDetail: 'Commercial details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_FLOOD_RISK_DANGER)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.commercialProperty.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.commercialPropertyDetail.answerId,
        otherBuildingDetail: 'Commercial details'
      }])
    })  
    it('Should return error when no checkbox is selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })
    it('Should display correct error message when no checbox is selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Select what is at risk from flooding, or &#39;you do not know&#39;')
    }) 
    it('Should return error when commercial property  is selected and no text is entered', async () => {
      const answerId = question.answers.commercialProperty.answerId.toString()
      const options = {
        url,
        payload: {          
          answerId,
          commercialPropertyDetail: ''}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })
    it('Should display correct error message when commercial property  is selected and no text is entered', async () => {
      const answerId = question.answers.commercialProperty.answerId.toString()
      const options = {
        url,
        payload: {          
          answerId,
          commercialPropertyDetail: ''}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Enter details about the type of buildings at risk from flooding')
    })
    it('Should return error when something else is selected and no text is entered', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {          
          answerId,
          otherDetails: ''}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })
    it('Should display correct error message when something else is selected and no text is entered', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {          
          answerId,
          otherDetails: ''}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Enter details about what is at risk from flooding')
    })                     
  })  
})
