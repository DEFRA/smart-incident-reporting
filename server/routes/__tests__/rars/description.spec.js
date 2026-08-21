import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { getServer } from '../../../../.jest/setup.js'
import { parse } from 'node-html-parser'

const baseAnswer = {
  questionId: 1350,
  questionAsked: '{problem} description',
  questionResponse: true,
  answerId: 1351
}

const problems = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_DESCRIPTION,
    header: 'Noise description',
    recurringUrl: constants.routes.NOISE_RECURRING,
    bulletPoints: [
      'what type of sound it is, for example a buzzing or banging',
      'what it sounds similar to, for example a car engine or hammer',
      'what activity you think is causing the noise, for example car breaking or digging'
    ]
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_DESCRIPTION,
    header: 'Dust description',
    recurringUrl: constants.routes.DUST_RECURRING,
    bulletPoints: [
      'the colour of the dust',
      'how thick or coarse the dust is',
      'what substance the dust seems to be, for example is it soot, or metallic',
      'what activity you think is causing the dust'
    ]
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_DESCRIPTION,
    header: 'Litter description',
    recurringUrl: constants.routes.LITTER_RECURRING,
    bulletPoints: [
      'what material the litter is made up of, for example is it household waste or packaging',
      'any distinctive or recognisable objects',
      'what activity you think is causing the litter, for example is it being dropped by vehicles'
    ]
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_DESCRIPTION,
    header: 'Mud description',
    recurringUrl: constants.routes.MUD_RECURRING,
    bulletPoints: [
      'the colour',
      'how deep it is',
      'if there is any smell',
      'what activity you think is causing the mud, for example large vehicles driving on verges'
    ]
  }
]

describe('RARS Description Routes', () => {
  describe.each(problems)('$problem description', ({ url, header, recurringUrl, bulletPoints }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })

      it('Should display the problem specific bullet points', async () => {
        const response = await getServer().inject({ method: 'GET', url })
        const html = parse(response.payload)
        const listItems = html.querySelectorAll('.govuk-list--bullet li').map(li => li.textContent.trim())
        expect(listItems).toEqual(bulletPoints)
      })
    })

    describe('POST', () => {
      it('Happy: accept and store a description', async () => {
        const description = 'This is a description of the problem'
        const options = { url, payload: { description } }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(recurringUrl)
        expect(response.request.yar.get(constants.redisKeys.RARS_DESCRIPTION)).toEqual([{
          ...baseAnswer,
          otherDetails: description
        }])
      })

      it('Sad: errors on no description provided', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a description')
      })
    })
  })
})
