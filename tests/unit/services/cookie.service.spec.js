const CookieService = require('../../../server/services/cookie.service.js')

const { SI_SESSION_KEY } = require('../../../server/utils/constants.js')

describe('CookieService', () => {
  describe('getSessionCookie', () => {
    it('should return the session cookie from the request', () => {
      // Mock the request object
      const request = {
        state: {
          [SI_SESSION_KEY]: 'sessionCookieValue'
        },
        url: {
          pathname: '/example'
        }
      }

      // Call the function
      const result = CookieService.getSessionCookie(request)

      // Assert the result
      expect(result).toBe('sessionCookieValue')
    })

    it('should log an error message if the session cookie is not found', () => {
      // Mock the console.log method
      console.log = jest.fn()

      // Mock the request object
      const request = {
        state: {},
        url: {
          pathname: '/example'
        }
      }

      // Call the function
      const result = CookieService.getSessionCookie(request)

      // Assert the result
      expect(result).toBeUndefined()

      // Assert the console.log method call
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith(
        `Session cookie not found for page ${request.url.pathname}`
      )
    })
  })
})
