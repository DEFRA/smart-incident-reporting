import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_IMAGES_OR_VIDEO
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'
const emailRequiredError = 'Enter your email address'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_CONTACT_DETAILS,
    redirect: constants.routes.SMELL_OTHER_INFORMATION,
    header: 'Contact details'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_CONTACT_DETAILS,
    redirect: constants.routes.NOISE_OTHER_INFORMATION,
    header: 'Contact details'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_CONTACT_DETAILS,
    redirect: constants.routes.DUST_OTHER_INFORMATION,
    header: 'Contact details'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_CONTACT_DETAILS,
    redirect: constants.routes.LITTER_OTHER_INFORMATION,
    header: 'Contact details'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_CONTACT_DETAILS,
    redirect: constants.routes.MUD_OTHER_INFORMATION,
    header: 'Contact details'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_CONTACT_DETAILS,
    redirect: constants.routes.VERMIN_OTHER_INFORMATION,
    header: 'Contact details'
  }
]

const sessionData = {
  [constants.redisKeys.RARS_CONTACT_DETAILS]: {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithYesPhotos = {
  [constants.redisKeys.RARS_CONTACT_DETAILS]: {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  },
  [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: [{
    questionId: question.questionId,
    answerId: question.answers.yesPhotos.answerId
  }, {
    questionId: question.questionId,
    answerId: question.answers.noVideo.answerId
  }]
}

const sessionDataWithYesVideo = {
  [constants.redisKeys.RARS_CONTACT_DETAILS]: {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  },
  [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: [{
    questionId: question.questionId,
    answerId: question.answers.noPhotos.answerId
  }, {
    questionId: question.questionId,
    answerId: question.answers.yesVideo.answerId
  }]
}

const sessionDataWithNoPhotos = {
  [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: [{
    questionId: question.questionId,
    answerId: question.answers.noPhotos.answerId
  }, {
    questionId: question.questionId,
    answerId: question.answers.noVideo.answerId
  }]
}

describe('RARS Contact Details Routes', () => {
  describe.each(problems)('$problem contact details', ({ url, redirect, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })

      it('Should display pre-populated contact details from session', async () => {
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="test name"')
        expect(response.payload).toContain('value="012345678910"')
        expect(response.payload).toContain('value="test@test.com"')
      })

      it('Should require email when yesPhotos was selected on images-or-video', async () => {
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithYesPhotos)
        expect(response.payload).toContain('Email address')
        expect(response.payload).not.toContain('Email address (optional)')
      })

      it('Should require email when yesVideo was selected on images-or-video', async () => {
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithYesVideo)
        expect(response.payload).toContain('Email address')
        expect(response.payload).not.toContain('Email address (optional)')
      })

      it('Should not require email when no photos was selected on images-or-video', async () => {
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithNoPhotos)
        expect(response.payload).toContain('Email address (optional)')
      })
    })

    describe('POST', () => {
      it('Happy: Accepts valid answers and redirects to other-information', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: '#+441234567890',
            email: 'test@test.com'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_CONTACT_DETAILS)).toEqual({
          reporterName: 'John Smith',
          reporterPhoneNumber: '#+441234567890',
          reporterEmailAddress: 'test@test.com'
        })
      })

      it('Happy: Accepts optional empty phone and email when email is not required', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: '',
            email: ''
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionDataWithNoPhotos)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_CONTACT_DETAILS)).toEqual({
          reporterName: 'John Smith',
          reporterPhoneNumber: '',
          reporterEmailAddress: ''
        })
      })

      it('Sad: Should error if invalid phone number', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: 'invalid-phone'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(phoneError)
      })

      it('Sad: Should error if invalid email address', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: '012345678910',
            email: 'not-an-email'
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(emailError)
      })

      it('Sad: Should require email if yesPhotos is selected', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: '012345678910',
            email: ''
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithYesPhotos)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(emailRequiredError)
      })

      it('Sad: Should require email if yesVideo is selected', async () => {
        const options = {
          url,
          payload: {
            fullName: 'John Smith',
            phone: '012345678910',
            email: ''
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionDataWithYesVideo)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(emailRequiredError)
      })
    })
  })
})
