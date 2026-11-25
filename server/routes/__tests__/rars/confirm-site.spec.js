import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS

const site = {
  id: 'EPR/AB1234CD',
  name: 'Acme Waste Ltd',
  address: '1, Industrial Estate, Testtown, TE1 0ST',
  distance: 0.1
}

const sessionData = {
  [constants.redisKeys.RARS_CONFIRM_SITE]: { selectedSite: site }
}

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_CONFIRM_SITE,
    chooseSite: constants.routes.SMELL_CHOOSE_SITE,
    next: constants.routes.SMELL_DESCRIPTION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_CONFIRM_SITE,
    chooseSite: constants.routes.NOISE_CHOOSE_SITE,
    next: constants.routes.NOISE_DESCRIPTION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_CONFIRM_SITE,
    chooseSite: constants.routes.DUST_CHOOSE_SITE,
    next: constants.routes.DUST_DESCRIPTION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_CONFIRM_SITE,
    chooseSite: constants.routes.LITTER_CHOOSE_SITE,
    next: constants.routes.LITTER_DESCRIPTION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_CONFIRM_SITE,
    chooseSite: constants.routes.MUD_CHOOSE_SITE,
    next: constants.routes.MUD_DESCRIPTION
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.PESTS_CONFIRM_SITE,
    chooseSite: constants.routes.PESTS_CHOOSE_SITE,
    next: constants.routes.PESTS_RECURRING
  }
]

describe('RARS Confirm Site Routes', () => {
  describe.each(problems)('$problem confirm site', ({ url, chooseSite, next }) => {
    describe('GET', () => {
      it('Happy: renders the confirm site page when a site has been selected', async () => {
        const response = await submitGetRequest(
          { url },
          'Confirm site',
          constants.statusCodes.OK,
          sessionData
        )

        expect(response.payload).toContain(site.name)
        expect(response.payload).toContain(site.address)
        expect(response.payload).toContain(`href="${chooseSite}"`)
      })

      it('Sad: redirects to choose site when no site has been selected', async () => {
        const response = await submitGetRequest(
          { url },
          undefined,
          constants.statusCodes.REDIRECT
        )

        expect(response.headers.location).toEqual(chooseSite)
      })
    })

    describe('POST', () => {
      it('Happy: stores the selected site details and redirects to the next page', async () => {
        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.REDIRECT,
          sessionData
        )

        expect(response.headers.location).toEqual(next)
        expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)).toEqual([
          {
            questionId: question.questionId,
            questionAsked: question.text,
            questionResponse: true,
            answerId: question.answers.siteName.answerId,
            otherDetails: site.name
          },
          {
            questionId: question.questionId,
            questionAsked: question.text,
            questionResponse: true,
            answerId: question.answers.sourceAddress.answerId,
            otherDetails: site.address
          },
          {
            questionId: question.questionId,
            questionAsked: question.text,
            questionResponse: true,
            answerId: question.answers.sourceTown.answerId,
            otherDetails: ''
          },
          {
            questionId: question.questionId,
            questionAsked: question.text,
            questionResponse: true,
            answerId: question.answers.sourcePostcode.answerId,
            otherDetails: ''
          }
        ])
      })

      it('Sad: redirects to choose site when no site has been selected', async () => {
        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.REDIRECT
        )

        expect(response.headers.location).toEqual(chooseSite)
      })
    })
  })
})
