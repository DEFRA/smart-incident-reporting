import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS

const site = {
  id: 'http://environment.data.gov.uk/public-register/industrial-installations/registration/EPR-AB1234CD',
  name: 'Acme Waste Ltd',
  address: '1, Industrial Estate, Testtown, TE1 0ST',
  streetAddress: '1, Industrial Estate',
  town: 'Testtown',
  postcode: 'TE1 0ST',
  registrationNumber: 'EPR/AB1234CD',
  primaryActivity: 'New Medium Combustion Plant',
  distance: 0.1234
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
        expect(response.payload).toContain(site.streetAddress)
        expect(response.payload).toContain(site.town)
        expect(response.payload).toContain(site.postcode)
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
        const answers = response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)
        expect(answers.every(answer => answer.questionId === question.questionId && answer.questionResponse === true)).toBe(true)
        expect(answers.map(({ answerId, otherDetails }) => [answerId, otherDetails])).toEqual([
          [question.answers.siteFinderUsed.answerId, 'Site finder (suspected source) completed successfully'],
          [question.answers.siteName.answerId, site.name],
          [question.answers.sourceAddress.answerId, site.streetAddress],
          [question.answers.sourceTown.answerId, site.town],
          [question.answers.sourcePostcode.answerId, site.postcode],
          [question.answers.registrationNumber.answerId, 'EPR/AB1234CD'],
          [question.answers.permitType.answerId, 'Industrial Installations'],
          [question.answers.distance.answerId, '0.12 km'],
          [question.answers.primaryActivity.answerId, 'New Medium Combustion Plant'],
          [question.answers.permitUrl.answerId, 'https://environment.data.gov.uk/public-register/industrial-installations/registration/EPR-AB1234CD']
        ])
      })

      it('Happy: stores the waste operations permit type and omits the primary activity when there is none', async () => {
        const wasteSite = {
          ...site,
          id: 'http://environment.data.gov.uk/public-register/waste-operations/registration/AB3208MT',
          primaryActivity: ''
        }
        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.REDIRECT,
          { [constants.redisKeys.RARS_CONFIRM_SITE]: { selectedSite: wasteSite } }
        )
        const answers = response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)
        expect(answers.find(answer => answer.answerId === question.answers.permitType.answerId).otherDetails).toBe('Waste Operations')
        expect(answers.some(answer => answer.answerId === question.answers.primaryActivity.answerId)).toBe(false)
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
