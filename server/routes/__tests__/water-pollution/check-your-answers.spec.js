import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-water-pollution.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
const header = 'Check your answers before sending your report'

let sessionData = {
  'water-pollution/contact-details': {
    reporterName: 'John Smith',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithoutAnswers = {
  'water-pollution/contact-details': {
    reporterName: '',
    reporterPhoneNumber: '',
    reporterEmailAddress: ''
  }
}

const sessionDataWithEmail = {
  'water-pollution/contact-details': {
    reporterName: '',
    reporterPhoneNumber: '',
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithoutEmail = {
  'water-pollution/contact-details': {
    reporterName: 'John Smith',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: ''
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Your details')
      expect(response.payload).toContain('Location and size of pollution')
      expect(response.payload).toContain('About the pollution')
    })
    it(`Happy: Should return correct view for your details section with contact-details ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('John Smith')
      expect(response.payload).toContain('012345678910')
      expect(response.payload).toContain('test@test.com')
    })
    it(`Happy: Should return correct view for your details section without contact-details ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithoutAnswers)
      expect(response.payload).toContain('Not given')
    })
    it(`Happy: Should return correct view for your details section with only email in contact-details ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithEmail)
      expect(response.payload).toContain('Not given')
      expect(response.payload).toContain('test@test.com')
    })
    it(`Happy: Reset answer for 'Images or videos available question' to no if email is not available in contact-details ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionDataWithoutEmail)
      expect(response.payload).toContain('Not given')
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        questionId: 2800,
        questionAsked: 'Do you want to send us any images or videos of the pollution?',
        questionResponse: true,
        answerId: 2802
      }])
    })
    it(`Happy: Should return correct answer for 'Images or videos available question' ${url}`, async () => {
      const answerData = {
        'water-pollution/images-or-video': [{
          questionId: 2800,
          questionAsked: 'Do you want to send us any images or videos of the pollution?',
          questionResponse: true,
          answerId: 2801
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Yes')
    })
    it(`Happy: Should return correct answer for 'Type of water' question ${url}`, async () => {
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 501
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('River')
    })
    it(`Happy: Should return correct answer for 'Location - Describe the locaion' question ${url}`, async () => {
      const answerData = {
        'water-pollution/location-option': [{
          questionId: 2600,
          questionAsked: 'Where did you see the pollution?',
          questionResponse: true,
          answerId: 2601
        }]
      }
      const otherData = {
        'water-pollution/location-description': [{
          questionId: 900,
          questionAsked: 'Where is the pollution?',
          questionResponse: true,
          answerId: 901,
          otherDetails: 'Test data for location description'
        }]
      }
      sessionData = { ...sessionData, ...answerData, ...otherData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Test data for location description')
    })
    it(`Happy: Should return correct answer for 'Less than 10m in size' question ${url}`, async () => {
      const answerData = {
        'water-pollution/less-than-10-metres': [{
          questionId: 700,
          questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
          questionResponse: true,
          answerId: 702
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('No')
    })
    it(`Happy: Should return correct answer for 'Less than 100 square metres in size' question ${url}`, async () => {
      const answerData = {
        'water-pollution/less-than-100-sq-metres': [{
          questionId: 800,
          questionAsked: 'Does the pollution cover an area less than 100 square metres in size?',
          questionResponse: true,
          answerId: 801
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Yes')
    })
    it(`Happy: Should return correct question label 'Less than 100 square metres in size' based on the answer for 'Type of water' question ${url}`, async () => {
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 502
        }]
      }
      const additionalData = {
        'water-pollution/less-than-100-sq-metres': [{
          questionId: 800,
          questionAsked: 'Does the pollution cover an area less than 100 square metres in size?',
          questionResponse: true,
          answerId: 801
        }]
      }
      sessionData = { ...sessionData, ...answerData, ...additionalData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Less than 100 square metres in size')
    })
    it(`Happy: Should return correct question label 'Less than 10m in size' based on the answer for 'Type of water' question ${url}`, async () => {
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 501
        }]
      }
      const additionalData = {
        'water-pollution/less-than-10-metres': [{
          questionId: 700,
          questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
          questionResponse: true,
          answerId: 701
        }]
      }
      sessionData = { ...sessionData, ...answerData, ...additionalData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Less than 10m in size')
    })
    it(`Happy: Should return correct answer for 'Size (estimated)' question ${url}`, async () => {
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 501
        }]
      }
      const additionalData1 = {
        'water-pollution/less-than-10-metres': [{
          questionId: 700,
          questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
          questionResponse: true,
          answerId: 702
        }]
      }
      const additionalData2 = {
        'water-pollution/pollution-length': [{
          questionId: 400,
          questionAsked: 'How far along the water feature does the pollution spread?',
          questionResponse: true,
          answerId: 402
        }]
      }
      sessionData = { ...sessionData, ...answerData, ...additionalData1, ...additionalData2 }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('100 to 500 metres')
    })
    it(`Happy: Should return correct answer for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-10-05T08:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('5th October 2024 at 09:09 am')
    })
    it(`Happy: Should accept a valid time for today and return correct answer for 'When did you see the pollution?' question ${url}`, async () => {
      const date = new Date()
      const dateTime = moment().hours(date.getHours().toString()).minutes(0).seconds(0).milliseconds(0)
      const answerData = {
        'water-pollution/when': dateTime.toISOString()
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Today at')
    })
    it(`Happy: Should accept a valid time for yesterday and return correct answer for 'When did you see the pollution?' question ${url}`, async () => {
      const dateTime = moment().hours(0).minutes(30).seconds(0).milliseconds(0).subtract(1, 'days')
      const answerData = {
        'water-pollution/when': dateTime.toISOString()
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Yesterday at')
    })
    it(`Happy: Should return correct answer with date suffix 'st' for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-11-01T09:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('1st November 2024 at 09:09 am')
    })
    it(`Happy: Should return correct answer with date suffix 'nd' for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-11-02T09:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('2nd November 2024 at 09:09 am')
    })
    it(`Happy: Should return correct answer with date suffix 'rd' for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-11-03T09:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('3rd November 2024 at 09:09 am')
    })
    it(`Happy: Should return correct answer with date suffix 'th' for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-11-04T09:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('4th November 2024 at 09:09 am')
    })
    it(`Happy: Should return correct answer with date suffix default case 'th' for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-10-25T08:09:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('25th October 2024 at 09:09 am')
    })
    it(`Happy: Should return correct answer with date for 12:00 pm scenario for 'When did you see the pollution?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/when': '2024-10-30T12:00:00.000Z'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('30th October 2024 at 12:00 pm')
    })
    it(`Happy: Should return correct answer for 'What do you think the pollution is?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/pollution-substance': [{
          questionId: 2900,
          questionAsked: 'What do you think the pollution is?',
          questionResponse: true,
          answerId: 2901
        },
        {
          questionId: 2900,
          questionAsked: 'What do you think the pollution is?',
          questionResponse: true,
          answerId: 2902
        },
        {
          questionId: 2900,
          questionAsked: 'What do you think the pollution is?',
          questionResponse: true,
          answerId: 2903
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Sewage')
      expect(response.payload).toContain('Oil or petrol')
      expect(response.payload).toContain('Agricultural waste')
    })
    it(`Happy: Should return correct answer for 'What does the pollution look like?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/pollution-appearance': [{
          questionId: 1000,
          questionAsked: 'What does the pollution look like?',
          questionResponse: true,
          answerId: 1002
        },
        {
          questionId: 1000,
          questionAsked: 'What does the pollution look like?',
          questionResponse: true,
          answerId: 1003
        },
        {
          questionId: 1000,
          questionAsked: 'What does the pollution look like?',
          questionResponse: true,
          answerId: 1004
        },
        {
          questionId: 1000,
          questionAsked: 'What does the pollution look like?',
          questionResponse: true,
          answerId: 1005,
          otherDetails: 'Something else data for pollution appearance'
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Cloudy or grey water')
      expect(response.payload).toContain('Foam or scum')
      expect(response.payload).toContain('Something else - Something else data for pollution appearance')
    })
    it(`Happy: Should return correct answer for 'Do you know where the pollution is coming from?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/source': [{
          questionId: 100,
          questionAsked: 'Do you know where the pollution is coming from?',
          questionResponse: true,
          answerId: 101
        },
        {
          questionId: 100,
          questionAsked: 'Do you know where the pollution is coming from?',
          questionResponse: true,
          answerId: 103,
          otherDetails: 'Test data for pollution source'
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Yes - Test data for pollution source')
    })
    it(`Happy: Should return correct answer for 'Have you seen any dead fish or animals?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/effect-on-wildlife': [{
          questionId: 200,
          questionAsked: 'Have you seen any dead or distressed fish or animals nearby?',
          questionResponse: true,
          answerId: 201
        },
        {
          questionId: 200,
          questionAsked: 'Have you seen any dead or distressed fish or animals nearby?',
          questionResponse: true,
          answerId: 203,
          otherDetails: 'Test data for effect on wildlife'
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Yes - Test data for effect on wildlife')
    })
    it(`Happy: Should return correct answer for 'Is there anything else you'd like to add?' question ${url}`, async () => {
      const answerData = {
        'water-pollution/other-information': 'Details of other information'
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Details of other information')
    })
    it(`Happy: Should return correct answer as No for 'Is there anything else you'd like to add?' question if no data is provided ${url}`, async () => {
      const answerData = {
        'water-pollution/other-information': ''
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('No')
    })
  })

  describe('POST', () => {
    it('Should accept and store a description', async () => {
      const options = {
        url
      }
      const response = await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        info: expect.any(Function)
      }),
      expect.objectContaining({
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 100,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterEmailAddress: 'test@test.com',
          otherDetails: 'test',
          questionSetId: 100,
          data: expect.arrayContaining([
            expect.objectContaining({
              questionId: 500,
              questionAsked: 'In what kind of water is the pollution?',
              questionResponse: true,
              answerId: 506
            }),
            expect.objectContaining({
              questionId: 500,
              questionAsked: 'In what kind of water is the pollution?',
              questionResponse: true,
              answerId: 508,
              otherDetails: 'this is a test'
            }),
            expect.objectContaining({
              questionId: 700,
              questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
              questionResponse: true,
              answerId: 702
            }),
            expect.objectContaining({
              questionId: 400,
              questionAsked: 'How far along the water feature does the pollution spread?',
              questionResponse: true,
              answerId: 403
            }),
            expect.objectContaining({
              questionId: 900,
              questionAsked: 'Where is the pollution?',
              questionResponse: true,
              answerId: 901,
              otherDetails: 'test location'
            }),
            expect.objectContaining({
              questionId: 1000,
              questionAsked: 'What does the pollution look like?',
              questionResponse: true,
              answerId: 1002
            }),
            expect.objectContaining({
              questionId: 1000,
              questionAsked: 'What does the pollution look like?',
              questionResponse: true,
              answerId: 1003
            }),
            expect.objectContaining({
              questionId: 2800,
              questionAsked: 'Do you want to send us any images or videos of the pollution?',
              questionResponse: true,
              answerId: 2801
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2901
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2905
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2907,
              otherDetails: 'other details'
            }),
            expect.objectContaining({
              questionId: 100,
              questionAsked: 'Do you know where the pollution is coming from?',
              questionResponse: true,
              answerId: 101
            }),
            expect.objectContaining({
              questionId: 100,
              questionAsked: 'Do you know where the pollution is coming from?',
              questionResponse: true,
              answerId: 103,
              otherDetails: 'other details'
            })
          ])
        })
      }))
      // expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
      expect(response.headers.location).toEqual(constants.routes.REPORT_SENT)
    })
    it('Should error if validatePayload fails', async () => {
      const { submitPostRequest } = await import('../../../__test-helpers__/server.js')
      const helpers = await import('../../../utils/helpers.js')
      helpers.validatePayload = jest.fn().mockImplementation(() => {
        return false
      })

      const otherInfo = 'This is a description of the water pollution'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      await submitPostRequest(options, 500)
    })
  })
})
