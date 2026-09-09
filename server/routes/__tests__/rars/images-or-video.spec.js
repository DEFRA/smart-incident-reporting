import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_IMAGES_OR_VIDEO

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_IMAGES_OR_VIDEO,
    redirect: constants.routes.SMELL_CONTACT_DETAILS
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_IMAGES_OR_VIDEO,
    redirect: constants.routes.NOISE_CONTACT_DETAILS
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_IMAGES_OR_VIDEO,
    redirect: constants.routes.DUST_CONTACT_DETAILS
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_IMAGES_OR_VIDEO,
    redirect: constants.routes.LITTER_CONTACT_DETAILS
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_IMAGES_OR_VIDEO,
    redirect: constants.routes.MUD_CONTACT_DETAILS
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_IMAGES_OR_VIDEO,
    redirect: constants.routes.VERMIN_CONTACT_DETAILS
  }
]

describe('RARS images-or-video routes', () => {
  describe.each(problems)('$problem images-or-video', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, question.text)
      })

      it('Should show selected photos option', async () => {
        const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, {
          [question.key]: [{
            ...baseAnswer,
            answerId: question.answers.yesPhotos.answerId
          }]
        })

        expect(response.payload).toContain(`value="${question.answers.yesPhotos.answerId}" checked`)
      })
    })
  })

  describe.each(problems)('$problem images-or-video sad path', ({ url }) => {
    describe('POST', () => {
      it('Sad: no checkbox selected, returns error state', async () => {
        const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK)

        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Select whether you have any photos or videos to include')
      })
    })
  })

  describe.each(problems)('$problem images-or-video redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it('Happy: accepts photos and redirects to contact details', async () => {
        const response = await submitPostRequest({
          url,
          payload: { answerId: question.answers.yesPhotos.answerId.toString() }
        })

        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect)
        expect(response.request.yar.get(question.key)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.yesPhotos.answerId
        }, {
          ...baseAnswer,
          answerId: question.answers.noVideo.answerId
        }])
      })

      it('Happy: accepts video and stores noPhotos plus yesVideo', async () => {
        const response = await submitPostRequest({
          url,
          payload: { answerId: question.answers.yesVideo.answerId.toString() }
        })

        expect(response.request.yar.get(question.key)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.noPhotos.answerId
        }, {
          ...baseAnswer,
          answerId: question.answers.yesVideo.answerId
        }])
      })

      it('Happy: accepts photos and video', async () => {
        const response = await submitPostRequest({
          url,
          payload: {
            answerId: [question.answers.yesPhotos.answerId.toString(), question.answers.yesVideo.answerId.toString()]
          }
        })

        expect(response.request.yar.get(question.key)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.yesPhotos.answerId
        }, {
          ...baseAnswer,
          answerId: question.answers.yesVideo.answerId
        }])
      })

      it('Happy: accepts no photos or video', async () => {
        const response = await submitPostRequest({
          url,
          payload: { answerId: question.answers.noPhotos.answerId.toString() }
        })

        expect(response.request.yar.get(question.key)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.noPhotos.answerId
        }, {
          ...baseAnswer,
          answerId: question.answers.noVideo.answerId
        }])
      })
    })
  })
})
