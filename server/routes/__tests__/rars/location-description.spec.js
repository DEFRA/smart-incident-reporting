import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_DESCRIPTION
const header = 'Location description'

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.SMELL_DESCRIPTION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.NOISE_DESCRIPTION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.DUST_DESCRIPTION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.LITTER_DESCRIPTION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.MUD_DESCRIPTION
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_DESCRIPTION,
    descriptionUrl: constants.routes.VERMIN_DESCRIPTION
  }
]

describe('RARS Location Description Routes', () => {
  describe.each(problems)('$problem location description', ({ url, descriptionUrl }) => {
    const sessionData = {
      [constants.redisKeys.RARS_LOCATION_DESCRIPTION]: [{
        questionId: baseAnswer.questionId,
        answerId: question.answers.locationDetails.answerId,
        otherDetails: 'test details'
      }]
    }

    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })

      it('Should return success response and correct view with previously stored answer', async () => {
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('test details</textarea>')
      })
    })

    describe('POST', () => {
      it('Happy: accept and store a location description', async () => {
        const locationDescription = 'This is a description of the location of the problem'
        const options = { url, payload: { locationDescription } }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(descriptionUrl)
        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_DESCRIPTION)).toEqual([{
          ...baseAnswer,
          otherDetails: locationDescription
        }])
      })

      it('Sad: errors on no locationDescription provided', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a description of the location')
      })
    })
  })
})
