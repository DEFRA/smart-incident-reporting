import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.WATER_POLLUTION_CONTACT_DETAILS
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'

const sessionData = {
  'water-pollution/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithYesPhotos = {
  'water-pollution/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  },
  'water-pollution/images-or-video': [{
    questionId: 2800,
    answerId: 2803
  }, {
    questionId: 2800,
    answerId: 2806
  }]
}

const sessionDataWithYesVideo = {
  'water-pollution/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  },
  'water-pollution/images-or-video': [{
    questionId: 2800,
    answerId: 2804
  }, {
    questionId: 2800,
    answerId: 2805
  }]
}

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view', async () => {
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="test name"')
      expect(response.result).toContain('value="012345678910"')
      expect(response.result).toContain('value="test@test.com"')
    })
    it(`Should show the correct service name and link for a water pollution service page on ${url}`, async () => {
      process.env.REGISTER_START_ROUTES = 'false'
      const response = await submitGetRequest({ url })
      const html = parse(response.payload)
      const serviceNameLink = html.querySelector('.govuk-service-navigation__link')
      expect(html.querySelector('.govuk-service-navigation__service-name').textContent).toContain(constants.serviceNames.WATER_POLLUTION)
      expect(serviceNameLink.getAttribute('href')).toBe(constants.urls.GOV_UK_WATER_POLLUTION)
      process.env.REGISTER_START_ROUTES = 'true'
    })
    it('Should require email when yesPhotos was selected on images-or-video', async () => {
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionDataWithYesPhotos)
      expect(response.payload).toContain('Email address')
      expect(response.payload).not.toContain('Email address (optional)')
    })

    it('Should require email when yesVideo was selected on images-or-video', async () => {
      const response = await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK, sessionDataWithYesVideo)
      expect(response.payload).toContain('Email address')
      expect(response.payload).not.toContain('Email address (optional)')
    })
  })
  describe('POST', () => {
    it('Happy: Accepts valid answers and redirects to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)).toEqual({
        reporterName: 'John Smith',
        reporterPhoneNumber: '#+441234567890',
        reporterEmailAddress: 'test@test.com'
      })
    })
    it('Sad: Should error with if invalid phone number', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: 'sdfsrt'
        }
      }
      const response = await submitPostRequest(options, 200, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(phoneError)
    })
    it('Sad: Should error with if invalid email address', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: 'sdfdsf'
        }
      }
      const response = await submitPostRequest(options, 200, constants.statusCodes.OK, sessionData)
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
      expect(response.payload).toContain('Enter your email address')
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
      expect(response.payload).toContain('Enter your email address')
    })
  })
})
