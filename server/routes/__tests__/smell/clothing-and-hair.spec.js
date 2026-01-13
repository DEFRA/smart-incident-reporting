import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.SMELL_CLOTHING_AND_HAIR
const question = questionSets.SMELL.questions.SMELL_CLOTHING_AND_HAIR
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url} if current smell`, async () => {
      const sessionData = {
        'smell/indoors': [{
          questionId: questionSets.SMELL.questions.SMELL_INDOORS.questionId,
          answerId: questionSets.SMELL.questions.SMELL_INDOORS.answers.yes.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url} if past smell`, async () => {
      const sessionData = {
        'smell/indoors': [{
          questionId: questionSets.SMELL.questions.SMELL_INDOORS.questionId,
          answerId: questionSets.SMELL.questions.SMELL_INDOORS.answers.no.answerId
        }]
      }
      const wasHeader = header.replace('Does', 'Did')
      await submitGetRequest({ url }, wasHeader, constants.statusCodes.OK, sessionData)
    })
    it(`Should show the correct service name and link for an odour/smell service page on ${url}`, async () => {
      process.env.REGISTER_START_ROUTES = 'false'
      const response = await submitGetRequest({ url })
      const html = parse(response.payload)
      const serviceNameLink = html.querySelector('.govuk-service-navigation__link')
      expect(html.querySelector('.govuk-service-navigation__service-name').textContent).toContain(constants.serviceNames.SMELL)
      expect(serviceNameLink.getAttribute('href')).toBe(constants.urls.GOV_UK_SMELL)
      process.env.REGISTER_START_ROUTES = 'true'
    })
  })

  describe('POST', () => {
    it('Happy: Yes and continues to smell/effect-on-daily-life', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_CLOTHING_AND_HAIR)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }])
    })
    it('Happy: No and continues to smell/effect-on-daily-life', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_CLOTHING_AND_HAIR)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })
    it('Sad: Rejects empty payload with current smell is noticeable indoors', async () => {
      const sessionData = {
        'smell/indoors': [{
          questionId: questionSets.SMELL.questions.SMELL_INDOORS.questionId,
          answerId: questionSets.SMELL.questions.SMELL_INDOORS.answers.yes.answerId
        }]
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if the smell sticks to your clothing or hair')
    })
    it('Sad: Rejects empty payload with current smell is not noticeable indoors', async () => {
      const sessionData = {
        'smell/indors': [{
          questionId: questionSets.SMELL.questions.SMELL_INDOORS.questionId,
          answerId: questionSets.SMELL.questions.SMELL_INDOORS.answers.no.answerId
        }]
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if the smell stuck to your clothing or hair')
    })
  })
})
