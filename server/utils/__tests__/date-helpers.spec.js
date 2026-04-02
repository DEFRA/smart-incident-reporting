import { formattedDate } from '../date-helpers.js'

describe('date-helpers', () => {
  describe('formattedDate', () => {
    it('should return the full formatted result string', () => {
      jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('2:48 pm')
      jest.spyOn(Date.prototype, 'toLocaleDateString')
        .mockReturnValueOnce('Monday')
        .mockReturnValueOnce('April')

      const result = formattedDate('2026-04-01T10:30:00.000Z')

      expect(result).toEqual('2:48 pm on Monday, 1 April 2026')

      jest.restoreAllMocks()
    })
  })
})
