import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.ILLEGAL_FISHING_ACTIVITY
const header = 'What illegal fishing activity do you want to report?'
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ACTIVITY
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should show the correct service name and link for an illegal fishing service page on ${url}`, async () => {
      process.env.REGISTER_START_ROUTES = 'false'
      const response = await submitGetRequest({ url })
      const html = parse(response.payload)
      const serviceNameLink = html.querySelector('.govuk-service-navigation__link')
      expect(html.querySelector('.govuk-service-navigation__service-name').textContent).toContain(constants.serviceNames.ILLEGAL_FISHING)
      expect(serviceNameLink.getAttribute('href')).toBe(constants.urls.GOV_UK_ILLEGAL_FISHING)
      process.env.REGISTER_START_ROUTES = 'true'
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId of \'Fishing without permission of the owner or club\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.withoutPermission.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE)
    })
    it('Happy: accepts valid answerId of \'Fishing without a rod licence\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.withoutRodLicense.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ROD_LICENCE)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.withoutRodLicense.answerId
      }])
    })
    it('Happy: accepts valid answerId of \'Fishing out of season\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.outOfSeason.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.outOfSeason.answerId
      }])
    })
    it('Happy: accepts valid answerId of \'Use of illegal fishing equipment\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.illegalFishingEquipment.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.illegalFishingEquipment.answerId
      }])
    })
    it('Happy: accepts valid answerId of \'Fishing for protected species (including seasonal)\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.protectedSpecies.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.protectedSpecies.answerId
      }])
    })
    it('Happy: accepts valid answerId of \'Something else\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const somethingElseDetails = 'test something else details'
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: somethingElseDetails
      }])
    })
    it('Happy: accepts valid answerIds of \'Fishing without permission of the owner or club\' and \'Fishing without a rod licence\' and redirects to illegal-fishing/rod-licence', async () => {
      const answerId = [
        question.answers.withoutPermission.answerId.toString(),
        question.answers.withoutRodLicense.answerId.toString()
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ROD_LICENCE)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: Number(answerId[0])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[1])
      }])
    })
    it('Happy: accepts valid answerIds of \'Fishing without a rod licence\', \'Use of illegal fishing equipment\' and \'Fishing for protected species (including seasonal)\' and redirects to illegal-fishing/rod-licence', async () => {
      const answerId = [
        question.answers.withoutRodLicense.answerId.toString(),
        question.answers.illegalFishingEquipment.answerId.toString(),
        question.answers.protectedSpecies.answerId.toString()
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ROD_LICENCE)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: Number(answerId[0])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[1])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[2])
      }])
    })
    it('Happy: accepts valid answerIds of \'Fishing out of season\', \'Use of illegal fishing equipment\' and \'Fishing for protected species (including seasonal)\' and redirects to illegal-fishing/location-option', async () => {
      const answerId = [
        question.answers.outOfSeason.answerId.toString(),
        question.answers.illegalFishingEquipment.answerId.toString(),
        question.answers.protectedSpecies.answerId.toString()
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: Number(answerId[0])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[1])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[2])
      }])
    })
    it('Sad: no checkbox is selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select the illegal activity you want to report')
    })
  })
})
