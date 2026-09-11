import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.SMELL_REPORT_SENT
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.NOISE_REPORT_SENT
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.DUST_REPORT_SENT
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.LITTER_REPORT_SENT
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.MUD_REPORT_SENT
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportSent: constants.routes.VERMIN_REPORT_SENT
  }
]

describe('RARS other information routes', () => {
  describe.each(problems)('$problem other-information', ({ url, redisKey, reportSent }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Is there anything else you\'d like to add')
      })
    })

    describe('POST', () => {
      it('Should accept and store a description', async () => {
        const otherInfo = 'This is a description of the problem'
        const options = {
          url,
          payload: {
            otherInfo
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
        expect(response.request.yar.get(redisKey)).toEqual(otherInfo)
        expect(response.headers.location).toEqual(reportSent)
      })

      it('Should show an error and not progress when otherInfo exceeds the character limit', async () => {
        const otherInfo = 'a'.repeat(constants.otherInformationCharacterLimit + 1)
        const options = {
          url,
          payload: {
            otherInfo
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(`Anything else you&#39;d like to add must be ${constants.otherInformationCharacterLimit} characters or less`)
        expect(response.request.yar.get(redisKey)).toBeNull()
      })
    })
  })
})
