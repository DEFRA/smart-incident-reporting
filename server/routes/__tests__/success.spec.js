import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.SUCCESS

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Thank you')
    })

    it(`Should display 'What happens next' heading for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Thank you')
      expect(response.payload).toContain('What happens next')
    })

    it(`Should display photo submission confirmation text for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Thank you')
      expect(response.payload).toContain('We have received your photos')
    })

    it(`Should display feedback link for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Thank you')
      expect(response.payload).toContain('<a href="feedback">Give feedback</a>')
    })
  })
})
