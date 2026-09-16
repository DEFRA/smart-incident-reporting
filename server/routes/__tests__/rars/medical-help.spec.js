import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_MEDICAL_HELP
const heading = 'Have you had to get any medical help or treatment?'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_MEDICAL_HELP,
    redirect: constants.routes.SMELL_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the smell'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_MEDICAL_HELP,
    redirect: constants.routes.NOISE_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the noise'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_MEDICAL_HELP,
    redirect: constants.routes.DUST_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the dust'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_MEDICAL_HELP,
    redirect: constants.routes.LITTER_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the litter'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_MEDICAL_HELP,
    redirect: constants.routes.MUD_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the mud'
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.VERMIN_MEDICAL_HELP,
    redirect: constants.routes.VERMIN_IMAGES_OR_VIDEO,
    errorText: 'Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the vermin/pests',
    sessionData: {
      [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests'
    }
  }
]

describe('RARS Medical Help Routes', () => {
  describe.each(problems)('$problem medical help', ({ url, redirect, errorText, sessionData = {} }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, heading, constants.statusCodes.OK, sessionData)
      })
    })

    describe('POST', () => {
      it('Sad: no answer selected, returns error state with dynamic error text', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })

      it('Happy: yes answer redirects to images or video', async () => {
        const options = { url, payload: { answerId: String(question.answers.yes.answerId) } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(redirect)
        expect(response.request.yar.get(question.key)).toEqual([{
          questionId: question.questionId,
          questionAsked: question.text,
          questionResponse: true,
          answerId: question.answers.yes.answerId
        }])
      })

      it('Happy: no answer redirects to images or video', async () => {
        const options = { url, payload: { answerId: String(question.answers.no.answerId) } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(redirect)
        expect(response.request.yar.get(question.key)).toEqual([{
          questionId: question.questionId,
          questionAsked: question.text,
          questionResponse: true,
          answerId: question.answers.no.answerId
        }])
      })
    })
  })

  it('Sad: vermin with no vermin type selected in session defaults error text to vermin', async () => {
    const options = { url: constants.routes.VERMIN_MEDICAL_HELP, payload: {} }
    const response = await submitPostRequest(options, constants.statusCodes.OK)
    expect(response.payload).toContain('There is a problem')
    expect(response.payload).toContain('Select &#39;yes&#39; if you have had to get any medical help, or treatment because of the vermin')
  })
})
