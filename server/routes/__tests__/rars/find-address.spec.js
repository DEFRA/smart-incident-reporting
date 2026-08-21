import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import captchaCheck from '../../../services/captchaCheck.js'

jest.mock('../../../services/captchaCheck.js', () => ({
  validate: jest.fn()
}))

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_FIND_ADDRESS,
    redirect: constants.routes.SMELL_CHOOSE_ADDRESS,
    exceededRedirect: '/smell/exceeded-attempts'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_FIND_ADDRESS,
    redirect: constants.routes.NOISE_CHOOSE_ADDRESS,
    exceededRedirect: '/noise/exceeded-attempts'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_FIND_ADDRESS,
    redirect: constants.routes.DUST_CHOOSE_ADDRESS,
    exceededRedirect: '/dust/exceeded-attempts'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_FIND_ADDRESS,
    redirect: constants.routes.LITTER_CHOOSE_ADDRESS,
    exceededRedirect: '/litter/exceeded-attempts'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_FIND_ADDRESS,
    redirect: constants.routes.MUD_CHOOSE_ADDRESS,
    exceededRedirect: '/mud/exceeded-attempts'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_FIND_ADDRESS,
    redirect: constants.routes.VERMIN_CHOOSE_ADDRESS,
    exceededRedirect: '/vermin/exceeded-attempts'
  }
]

describe('RARS Find Address Routes', () => {
  describe.each(problems)('$problem find address', ({ url, redirect, exceededRedirect }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Find your address')
      })

      it('Should return success response with prefilled data from session', async () => {
        const sessionData = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: {
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST'
          }
        }
        const response = await submitGetRequest({ url }, 'Find your address', constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="Test House"')
        expect(response.payload).toContain('value="TE1 0ST"')
      })

      it('Should render the captcha widget', async () => {
        const response = await submitGetRequest({ url }, 'Find your address', constants.statusCodes.OK)
        expect(response.payload).toContain('id="friendly-captcha"')
      })

      it('Should return success response when counter already has a value', async () => {
        const response = await submitGetRequest({ url }, 'Find your address', constants.statusCodes.OK, { counter: 5 })
        expect(response.payload).toContain('Find your address')
      })
    })

    describe('POST', () => {
      it('Happy: accepts valid postcode with building details and redirects to choose address', async () => {
        captchaCheck.validate.mockResolvedValueOnce(true)
        const options = {
          url,
          payload: {
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST',
            'frc-captcha-response': 'test123'
          }
        }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_FIND_ADDRESS)).toEqual({
          buildingDetails: 'Test House',
          postcode: 'TE1 0ST'
        })
      })

      it('Happy: accepts valid postcode without building details and redirects to choose address', async () => {
        captchaCheck.validate.mockResolvedValueOnce(true)
        const options = {
          url,
          payload: {
            buildingDetails: '',
            postcode: 'TE1 0ST',
            'frc-captcha-response': 'test123'
          }
        }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
      })

      it('Sad: errors when no postcode provided', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a postcode')
      })

      it('Sad: errors when postcode is invalid', async () => {
        captchaCheck.validate.mockResolvedValueOnce(true)
        const options = {
          url,
          payload: {
            buildingDetails: '',
            postcode: 'INVALID',
            'frc-captcha-response': 'test123'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a full postcode, for example W1 8QS')
      })

      it('Sad: redirects to exceeded attempts when counter exceeds limit', async () => {
        captchaCheck.validate.mockResolvedValueOnce(true)
        const options = {
          url,
          payload: {
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST',
            'frc-captcha-response': 'test123'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, { counter: 20 })
        expect(response.headers.location).toEqual(exceededRedirect)
      })

      it('Sad: errors when captcha check fails', async () => {
        captchaCheck.validate.mockResolvedValueOnce(false)
        const options = {
          url,
          payload: {
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST',
            'frc-captcha-response': 'test123'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('You cannot continue until Friendly Captcha')
      })
    })
  })
})
