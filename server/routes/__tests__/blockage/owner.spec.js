import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_OWNER
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_OWNER
const blockageTypeQuestion = questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/owner': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.no.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it.each([
      {
        blockageType: 'vehicle',
        answerId: blockageTypeQuestion.answers.vehicle.answerId,
        expectedTitle: 'Do you know who is responsible for the vehicle?'
      },
      {
        blockageType: 'rubbish',
        answerId: blockageTypeQuestion.answers.rubbish.answerId,
        expectedTitle: 'Do you know who is responsible for the material blocking the river?'
      },
      {
        blockageType: 'fallenTree',
        answerId: blockageTypeQuestion.answers.fallenTree.answerId,
        expectedTitle: 'Do you know who is responsible for the tree or vegetation?'
      },
      {
        blockageType: 'other',
        answerId: blockageTypeQuestion.answers.somethingElse.answerId,
        expectedTitle: 'Do you know who is responsible for causing the blockage?'
      }
    ])('Should display correct title for $blockageType blockage type', async ({ answerId, expectedTitle }) => {
      const sessionWithType = {
        'blockage/blockage-type': [{
          questionId: blockageTypeQuestion.questionId,
          answerId
        }]
      }
      const response = await submitGetRequest({ url }, expectedTitle, constants.statusCodes.OK, sessionWithType)
      expect(response.payload).toContain(expectedTitle)
    })

    it(`Should pre-select saved answer from session for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="182" checked>')
    })
  })

  describe('POST', () => {
    it.each([
      { answer: 'yes', description: 'yes' },
      { answer: 'no', description: 'no' }
    ])('Should redirect to blockage/images-or-video when $description selected', async ({ answer }) => {
      const answerId = question.answers[answer].answerId
      const options = {
        url,
        payload: {
          answerId,
          yesDetails: answer === 'yes' ? 'Test company details' : undefined
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_IMAGES_OR_VIDEO)
    })

    it('Should save yes answer with details to session', async () => {
      const answerId = question.answers.yes.answerId
      const yesDetails = 'Test company responsible'
      const options = {
        url,
        payload: {
          answerId,
          yesDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(question.key)).toEqual([
        {
          ...baseAnswer,
          answerId
        },
        {
          ...baseAnswer,
          answerId: question.answers.yesDetails.answerId,
          otherDetails: yesDetails
        }
      ])
    })

    it('Should save no answer to session', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(question.key)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    it('Should return error when no radio selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })

    it.each([
      {
        blockageType: 'vehicle',
        answerId: blockageTypeQuestion.answers.vehicle.answerId,
        expectedError: 'Select &#39;yes&#39; if you know who owns the vehicle'
      },
      {
        blockageType: 'rubbish',
        answerId: blockageTypeQuestion.answers.rubbish.answerId,
        expectedError: 'Select &#39;yes&#39; if you know who is responsible for the material blocking the river'
      },
      {
        blockageType: 'fallenTree',
        answerId: blockageTypeQuestion.answers.fallenTree.answerId,
        expectedError: 'Select &#39;yes&#39; if you know who is responsible for the tree or vegetation'
      },
      {
        blockageType: 'other',
        answerId: 999,
        expectedError: 'Select &#39;yes&#39; if you know who is responsible for causing the blockage'
      }
    ])('Should display correct error message for $blockageType when no radio selected', async ({ answerId, expectedError }) => {
      const sessionWithType = {
        'blockage/blockage-type': [{
          questionId: blockageTypeQuestion.questionId,
          answerId
        }]
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionWithType)
      expect(response.payload).toContain(expectedError)
    })

    it('Should return error when yes selected but no details provided', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })

    it('Should display correct error message when yes selected but no details provided', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Enter details about the person or company responsible')
    })

    it('Should return error when yes selected but details only contains whitespace', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: '   '
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Enter details about the person or company responsible')
    })

    it('Should keep yes selected when validation fails for missing details', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('name="answerId" type="radio" value="181" checked')
    })
  })
})
