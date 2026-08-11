import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  answerId: 'yes',
  siteName: 'Site name',
  sourceAddress: 'Address Line',
  sourceTown: 'town or city',
  sourcePostcode: 'WA4 1HT'
}

const buildAnswers = data => ([
  {
    ...baseAnswer,
    answerId: question.answers.siteName.answerId,
    otherDetails: data.siteName
  },
  {
    ...baseAnswer,
    answerId: question.answers.sourceAddress.answerId,
    otherDetails: data.sourceAddress
  },
  {
    ...baseAnswer,
    answerId: question.answers.sourceTown.answerId,
    otherDetails: data.sourceTown
  },
  {
    ...baseAnswer,
    answerId: question.answers.sourcePostcode.answerId,
    otherDetails: data.sourcePostcode
  }
])

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the smell?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the smell is coming from',
    redirect: {
      locationHome: constants.routes.SMELL_LOCATION_HOME,
      contactLocalCouncil: constants.routes.SMELL_CONTACT_LOCAL_COUNCIL
    }
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the noise?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the noise is coming from',
    redirect: {
      locationHome: constants.routes.NOISE_LOCATION_HOME,
      contactLocalCouncil: constants.routes.NOISE_CONTACT_LOCAL_COUNCIL
    }
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the dust?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the dust is coming from',
    redirect: {
      locationHome: constants.routes.DUST_LOCATION_HOME,
      contactLocalCouncil: constants.routes.DUST_CONTACT_LOCAL_COUNCIL
    }
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the litter?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the litter is coming from',
    redirect: {
      locationHome: constants.routes.LITTER_LOCATION_HOME,
      contactLocalCouncil: constants.routes.LITTER_CONTACT_LOCAL_COUNCIL
    }
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the mud?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the mud is coming from',
    redirect: {
      locationHome: constants.routes.MUD_LOCATION_HOME,
      contactLocalCouncil: constants.routes.MUD_CONTACT_LOCAL_COUNCIL
    }
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_SOURCE_DETAILS,
    header: 'Do you know the site or business responsible for the vermin/pests?',
    errorText: 'Select &#39;yes&#39; if you can give details about where the vermin is coming from',
    redirect: {
      locationHome: constants.routes.VERMIN_LOCATION_HOME,
      contactLocalCouncil: constants.routes.VERMIN_CONTACT_LOCAL_COUNCIL
    }
  }
]

describe('RARS Source Details Routes', () => {
  describe.each(problems)('$problem source details', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests' }
          : {}

        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })
    })
  })

  describe.each(problems)('$problem source details sad path', ({ url, errorText }) => {
    describe('POST', () => {
      it('Sad: errors on no fields provided', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })

      it('Sad: valid answerId yes but errors on no fields provided', async () => {
        const options = { url, payload: { answerId: 'yes' } }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a name')
        expect(response.payload).toContain('Enter a town or city')
      })

      it('Sad: errors on invalid postcode provided', async () => {
        const options = {
          url,
          payload: { ...payload, sourcePostcode: 'sdgfsfdgfdsgfdg' }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a full UK postcode')
      })
    })
  })

  describe.each(problems)('$problem source details redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it('Happy: accepts valid answerId no and redirects to contact local council', async () => {
        const options = { url, payload: { answerId: 'no' } }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect.contactLocalCouncil)
      })

      it('Happy: accepts valid answerId yes and complete address with valid postcode', async () => {
        const options = { url, payload }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect.locationHome)
        expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)).toEqual(buildAnswers(payload))
      })

      it('Happy: accepts valid answerId yes and partial address with mandatory fields only', async () => {
        const partialPayload = { ...payload, sourceAddress: '' }
        const options = { url, payload: partialPayload }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect.locationHome)
        expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)).toEqual(buildAnswers(partialPayload))
      })

      it('Happy: strips special characters from postcode', async () => {
        const dirtyPayload = { ...payload, sourcePostcode: 'WA4 &^%$%$--1HT' }
        const options = { url, payload: dirtyPayload }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect.locationHome)
        expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE_DETAILS)).toEqual(buildAnswers({ ...dirtyPayload, sourcePostcode: 'WA4 1HT' }))
      })
    })
  })
})
