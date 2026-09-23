import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-rars.js'
import { questionSets } from '../../../utils/question-sets.js'

jest.mock('../../../services/service-bus.js')

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.smell
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.noise
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.dust
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.litter
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.mud
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.PESTS_OTHER_INFORMATION,
    redisKey: constants.redisKeys.RARS_OTHER_INFORMATION,
    reportType: questionSets.REPORT_REGULATED_SITE.reportTypes.vermin
  }
]

describe('RARS other information routes', () => {
  describe.each(problems)('$problem other-information', ({ url, redisKey, reportType }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Is there anything else you\'d like to add')
      })

      it('Should keep Friendly Captcha hidden until JavaScript runs', async () => {
        const response = await submitGetRequest({ url }, 'Is there anything else you\'d like to add')

        expect(response.payload).toContain('id="friendly-captcha-container" hidden')
        expect(response.payload).toContain('id="friendly-captcha"')
      })

      it('Should not render Friendly Captcha when it was completed earlier', async () => {
        const sessionData = {
          [constants.redisKeys.FRIENDLY_CAPTCHA_COMPLETED]: true
        }
        const response = await submitGetRequest(
          { url },
          'Is there anything else you\'d like to add',
          constants.statusCodes.OK,
          sessionData
        )

        expect(response.payload).not.toContain('id="friendly-captcha"')
      })
    })

    describe('POST', () => {
      it('Should accept and store a description', async () => {
        const otherInfo = 'This is a description of the problem'
        const options = {
          url,
          headers: {
            'user-agent': userAgent
          },
          payload: {
            otherInfo
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, session)

        expect(sendMessage).toHaveBeenCalledTimes(1)
        expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
          info: expect.any(Function)
        }),
        expect.objectContaining({
          reportingAnEnvironmentalProblem: expect.objectContaining({
            reportType,
            reporterName: 'John Smith',
            reporterPhoneNumber: '012345678910',
            reporterEmailAddress: 'test@test.com',
            otherDetails: otherInfo,
            questionSetId: reportType,
            ipAddress: '127.0.0.1',
            browserType: 'Chrome',
            deviceType: 'laptop',
            javascriptStatus: 'off',
            friendlyCaptchaStatus: 'not completed',
            data: expect.arrayContaining([
              expect.objectContaining({ questionId: 1600, answerId: 1601 }),
              expect.objectContaining({ questionId: 3200, answerId: 3202, otherDetails: 'test' }),
              expect.objectContaining({ questionId: 3100, answerId: 3101 }),
              expect.objectContaining({ questionId: 2600, answerId: 2601 }),
              expect.objectContaining({ questionId: 1900, answerId: 1901 }),
              expect.objectContaining({ questionId: 2400, answerId: 2401 }),
              expect.objectContaining({ questionId: 2500, answerId: 2501 }),
              expect.objectContaining({ questionId: 3300, answerId: 3301 }),
              expect.objectContaining({ questionId: 2800, answerId: 2801 })
            ])
          })
        }))
        expect(response.request.yar.get(redisKey)).toEqual(otherInfo)
        expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
        expect(response.headers.location).toEqual(constants.routes.REPORT_SENT)
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
        expect(sendMessage).not.toHaveBeenCalled()
      })
    })
  })
})
