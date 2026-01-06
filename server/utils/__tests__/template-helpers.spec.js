import { findErrorMessageById, getAnswer } from '../template-helpers.js'

describe('template-helpers', () => {
  describe('findErrorMessageById', () => {
    it('should return error message when matching id is found', () => {
      const errorSummary = {
        errorList: [
          { text: 'Error 1', href: '#field1' },
          { text: 'Error 2', href: '#field2' },
          { text: 'Error 3', href: '#field3' }
        ]
      }
      const result = findErrorMessageById(errorSummary, 'field2')
      expect(result).toEqual({ text: 'Error 2', href: '#field2' })
    })

    it('should return undefined when no matching id is found', () => {
      const errorSummary = {
        errorList: [
          { text: 'Error 1', href: '#field1' },
          { text: 'Error 2', href: '#field2' }
        ]
      }
      const result = findErrorMessageById(errorSummary, 'field3')
      expect(result).toBeUndefined()
    })

    it('should return undefined when errorSummary is null', () => {
      const result = findErrorMessageById(null, 'field1')
      expect(result).toBeUndefined()
    })

    it('should return undefined when errorSummary is undefined', () => {
      const result = findErrorMessageById(undefined, 'field1')
      expect(result).toBeUndefined()
    })

    it('should return undefined when errorList is missing', () => {
      const errorSummary = {}
      const result = findErrorMessageById(errorSummary, 'field1')
      expect(result).toBeUndefined()
    })

    it('should return undefined when errorList is empty', () => {
      const errorSummary = {
        errorList: []
      }
      const result = findErrorMessageById(errorSummary, 'field1')
      expect(result).toBeUndefined()
    })

    it('should match first occurrence when multiple errors have same id', () => {
      const errorSummary = {
        errorList: [
          { text: 'Error 1', href: '#field1' },
          { text: 'Error 2', href: '#field1' },
          { text: 'Error 3', href: '#field2' }
        ]
      }
      const result = findErrorMessageById(errorSummary, 'field1')
      expect(result).toEqual({ text: 'Error 1', href: '#field1' })
    })
  })

  describe('getAnswer', () => {
    it('should return otherDetails when present', () => {
      const answers = [
        { answerId: 1, otherDetails: 'Some details' }
      ]
      const result = getAnswer(answers, 1)
      expect(result).toBe('Some details')
    })

    it('should return otherBuildingDetail when present', () => {
      const answers = [
        { answerId: 2, otherBuildingDetail: 'Building details' }
      ]
      const result = getAnswer(answers, 2)
      expect(result).toBe('Building details')
    })

    it('should prioritize otherDetails over otherBuildingDetail when both present', () => {
      const answers = [
        { answerId: 3, otherDetails: 'Other details', otherBuildingDetail: 'Building details' }
      ]
      const result = getAnswer(answers, 3)
      expect(result).toBe('Other details')
    })

    it('should return true when answer exists without otherDetails or otherBuildingDetail', () => {
      const answers = [
        { answerId: 4 }
      ]
      const result = getAnswer(answers, 4)
      expect(result).toBe(true)
    })

    it('should return empty string when answer is not found', () => {
      const answers = [
        { answerId: 1, otherDetails: 'Details' }
      ]
      const result = getAnswer(answers, 999)
      expect(result).toBe('')
    })

    it('should return empty string when answers is null', () => {
      const result = getAnswer(null, 1)
      expect(result).toBe('')
    })

    it('should return empty string when answers is undefined', () => {
      const result = getAnswer(undefined, 1)
      expect(result).toBe('')
    })

    it('should return empty string when answers is empty array', () => {
      const answers = []
      const result = getAnswer(answers, 1)
      expect(result).toBe('')
    })

    it('should handle answers with multiple items and return correct match', () => {
      const answers = [
        { answerId: 1, otherDetails: 'Details 1' },
        { answerId: 2, otherBuildingDetail: 'Building 2' },
        { answerId: 3 }
      ]
      expect(getAnswer(answers, 1)).toBe('Details 1')
      expect(getAnswer(answers, 2)).toBe('Building 2')
      expect(getAnswer(answers, 3)).toBe(true)
    })

    it('should return true for otherDetails when value is empty string', () => {
      const answers = [
        { answerId: 5, otherDetails: '' }
      ]
      const result = getAnswer(answers, 5)
      expect(result).toBe(true)
    })

    it('should return true for otherBuildingDetail when value is empty string', () => {
      const answers = [
        { answerId: 6, otherBuildingDetail: '' }
      ]
      const result = getAnswer(answers, 6)
      expect(result).toBe(true)
    })

    it('should handle numeric answerId matching', () => {
      const answers = [
        { answerId: 100, otherDetails: 'Numeric ID' }
      ]
      const result = getAnswer(answers, 100)
      expect(result).toBe('Numeric ID')
    })

    it('should return true when answer has false value for other properties', () => {
      const answers = [
        { answerId: 7, someOtherProperty: false }
      ]
      const result = getAnswer(answers, 7)
      expect(result).toBe(true)
    })
  })
})
