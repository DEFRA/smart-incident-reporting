import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'

// Helper to build session data for different scenarios
function buildSession({ email = '', agreed = false } = {}) {
  return {
    [constants.redisKeys.QUESTION_SET_ID]: 100,
    [constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS]: {
      reporterEmailAddress: email
    },
    [constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO]: [
      { questionResponse: agreed }
    ]
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })
    it(`Should return success response and correct paragraph when email is not provided and Yes is selected for images question ${url}`, async () => {      
      const sessionData = buildSession({ email: '', agreed: true })
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<p>You can now <a>upload any photos</a> you have that might help us investigate the problem.</p>')
    }) 

    it(`Should return success response and correct paragraph when email is provided and  Yes is selected for images question  ${url}`, async () => {   
      const sessionData = buildSession({ email: 'test@test.com', agreed: true })  
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<p>We have sent a confirmation of your report and a reference number to test@test.com</p>')
    })  
    it(`Should return success response and correct view when email is not provided and No is selected for images question ${url}`, async () => {      
      const sessionData = buildSession({ email: '', agreed: false })  
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).not.toContain('<p>You can now <a>upload any photos</a> you have that might help us investigate the problem.</p>')
    })         
})

