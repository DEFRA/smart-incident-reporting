import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_EFFECT_ON_HEALTH

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.SMELL_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the smell, or &#39;none of these&#39;'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.NOISE_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the noise, or &#39;none of these&#39;'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.DUST_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the dust, or &#39;none of these&#39;'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.LITTER_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the litter, or &#39;none of these&#39;'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.MUD_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the mud, or &#39;none of these&#39;'
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.VERMIN_EFFECT_ON_HEALTH,
    medicalHelp: constants.routes.VERMIN_MEDICAL_HELP,
    errorText: 'Select any health conditions caused by the vermin/pests, or &#39;none of these&#39;',
    sessionData: {
      [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests'
    }
  }
]

describe('RARS Effect On Health Routes', () => {
  describe.each(problems)('$problem effect on health', ({ problem, url, medicalHelp, errorText, sessionData = {} }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest(
          { url },
          `Has the ${problem} caused any of the following issues?`,
          constants.statusCodes.OK,
          sessionData
        )
      })
    })

    describe('POST', () => {
      it('Sad: no checkbox selected, returns error state with dynamic error text', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })

      it('Happy: single answer submitted as a string redirects to medical help', async () => {
        const options = { url, payload: { answerId: String(question.answers.headache.answerId) } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(medicalHelp)
        expect(response.request.yar.get(question.key)).toEqual([{
          questionId: question.questionId,
          questionAsked: question.text,
          questionResponse: true,
          answerId: question.answers.headache.answerId
        }])
      })

      it('Happy: multiple answers including none of these redirects to medical help', async () => {
        const options = {
          url,
          payload: {
            answerId: [
              String(question.answers.headache.answerId),
              String(question.answers.mentalHealthIssues.answerId),
              String(question.answers.noneOfthese.answerId)
            ]
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(medicalHelp)
        expect(response.request.yar.get(question.key)).toEqual([
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.headache.answerId },
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.mentalHealthIssues.answerId },
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.noneOfthese.answerId }
        ])
      })

      it('Happy: something else answer with details adds an extra answer for the details', async () => {
        const options = {
          url,
          payload: {
            answerId: [String(question.answers.somethingElse.answerId)],
            somethingElseDetails: 'Feeling dizzy'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(medicalHelp)
        expect(response.request.yar.get(question.key)).toEqual([
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.somethingElse.answerId },
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.somethingElseDetails.answerId, otherDetails: 'Feeling dizzy' }
        ])
      })

      it('Happy: something else answer without details does not add an extra answer', async () => {
        const options = { url, payload: { answerId: [String(question.answers.somethingElse.answerId)] } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toBe(medicalHelp)
        expect(response.request.yar.get(question.key)).toEqual([
          { questionId: question.questionId, questionAsked: question.text, questionResponse: true, answerId: question.answers.somethingElse.answerId }
        ])
      })
    })
  })

  it('Sad: vermin with no vermin type selected in session defaults error text to vermin', async () => {
    const options = { url: constants.routes.VERMIN_EFFECT_ON_HEALTH, payload: {} }
    const response = await submitPostRequest(options, constants.statusCodes.OK)
    expect(response.payload).toContain('There is a problem')
    expect(response.payload).toContain('Select any health conditions caused by the vermin, or &#39;none of these&#39;')
  })
})
