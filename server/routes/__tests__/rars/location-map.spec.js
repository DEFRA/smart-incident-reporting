import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_MAP,
    redirect: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_MAP,
    redirect: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_MAP,
    redirect: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_MAP,
    redirect: constants.routes.LITTER_LOCATION_DESCRIPTION_OPTIONAL
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_MAP,
    redirect: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_MAP,
    redirect: constants.routes.VERMIN_LOCATION_DESCRIPTION_OPTIONAL
  }
]

describe('RARS Location Map Routes', () => {
  describe.each(problems)('$problem location map', ({ url, redirect }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Mark the location')
      })

      it('Should pre-fill the map with a previously stored point', async () => {
        const sessionData = {
          [constants.redisKeys.RARS_LOCATION_MAP]: [{
            ...baseAnswer,
            answerId: question.answers.nationalGridReference.answerId,
            otherDetails: 'SJ 65739 43015'
          }, {
            ...baseAnswer,
            answerId: question.answers.easting.answerId,
            otherDetails: '365739'
          }, {
            ...baseAnswer,
            answerId: question.answers.northing.answerId,
            otherDetails: '343015'
          }]
        }
        const response = await submitGetRequest({ url }, 'Mark the location', constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('"point":[365739,343015]')
      })
    })

    describe('POST', () => {
      it('Happy: accept and store a point as a national grid reference', async () => {
        const point = '[365739.764, 343015.986]'
        const options = {
          url,
          payload: {
            point
          }
        }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_MAP)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.nationalGridReference.answerId,
          otherDetails: 'SJ 65739 43015'
        }, {
          ...baseAnswer,
          answerId: question.answers.easting.answerId,
          otherDetails: '365739'
        }, {
          ...baseAnswer,
          answerId: question.answers.northing.answerId,
          otherDetails: '343015'
        }, {
          ...baseAnswer,
          answerId: question.answers.lng.answerId,
          otherDetails: '-2.511745'
        }, {
          ...baseAnswer,
          answerId: question.answers.lat.answerId,
          otherDetails: '52.983397'
        }])
      })

      it('Sad: errors on no point provided', async () => {
        const options = {
          url,
          payload: {}
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Mark a location by clicking or tapping the map')
      })
    })
  })
})
