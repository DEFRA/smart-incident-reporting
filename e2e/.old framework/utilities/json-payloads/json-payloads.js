class JSONPayloads {
  async CheckQuestionSet (questions, expectedAnswerIdsSets, data) {
    const actualAnswerIds = questions.map(question => question.answerId)
    // Loop through each set of expected answerIds in expectedAnswerIdsSets
    for (let iterationCounter = 0; iterationCounter < expectedAnswerIdsSets.length; iterationCounter++) {
      const expectedAnswerIdsSet = expectedAnswerIdsSets[iterationCounter]
      const expectedAnswerIds = expectedAnswerIdsSet.values
      // Sort both expected and actual answer IDs
      const expectedSorted = expectedAnswerIds.sort((a, b) => a - b)
      const actualSorted = actualAnswerIds.sort((a, b) => a - b)
      console.log('expectedSorted and actualSorted are: ' + JSON.stringify(expectedSorted) + ' AND ' + JSON.stringify(actualSorted))
      // Check if expected answerIds match any of the actualAnswerIds
      const setsMatch = JSON.stringify(expectedSorted) === JSON.stringify(actualSorted)
      if (setsMatch) {
        console.log(`Function Match found for expected answer set '${expectedAnswerIdsSet.name}'.`)
        console.log(`Function Expected: ${expectedAnswerIds}`)
        console.log(`Function Actual: ${actualAnswerIds}`)
        break
      }
    }
    console.log('data is now: ' + data)
    const dataValid = JSON.parse(data)
    // Validate structure
    expect(dataValid).toHaveProperty('reportingAnEnvironmentalProblem')
    expect(typeof dataValid.reportingAnEnvironmentalProblem).toBe('object')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('sessionGuid')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.sessionGuid).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('reportType')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.reportType).toBe('number')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('datetimeObserved')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.datetimeObserved).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('datetimeReported')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.datetimeReported).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('otherDetails')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.otherDetails).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('questionSetId')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.questionSetId).toBe('number')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('data')
    expect(Array.isArray(dataValid.reportingAnEnvironmentalProblem.data)).toBe(true)
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('reporterName')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.reporterName).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('reporterPhoneNumber')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.reporterPhoneNumber).toBe('string')
    expect(dataValid.reportingAnEnvironmentalProblem).toHaveProperty('reporterAccessCode')
    expect(typeof dataValid.reportingAnEnvironmentalProblem.reporterAccessCode).toBe('string')
    // Validate element names within data array
    questions.forEach(question => {
      expect(question).toHaveProperty('questionId')
      expect(typeof question.questionId).toBe('number')
      expect(question).toHaveProperty('questionAsked')
      expect(typeof question.questionAsked).toBe('string')
      expect(question).toHaveProperty('questionResponse')
      expect(typeof question.questionResponse).toBe('boolean')
      expect(question).toHaveProperty('answerId')
      expect(typeof question.answerId).toBe('number')
      // Only check for 'otherDetails' if it exists in the question object
      if ('otherDetails' in question) {
        expect(question).toHaveProperty('otherDetails')
        expect(typeof question.otherDetails).toBe('string')
      }
    })
  }

  async isValidNGR (ngr) {
    console.log('the ngr is: ' + ngr)
    // Regular expression to match NGR pattern
    const ngrPattern = /^[A-Z]{2}\s\d{2,5}\s\d{2,5}$/
    // Check if the NGR matches the pattern
    if (!ngrPattern.test(ngr)) {
      return false
    }
    // Split the NGR into parts
    const parts = ngr.split(' ')
    if (parts.length !== 3) {
      return false
    }
    // First segment contains 2 grid letters (unused in validation)
    const easting = parts[1]
    const northing = parts[2]
    // Ensure the easting and northing have equal length (can be odd or even)
    if (easting.length !== northing.length) {
      return false
    }
    return true
  }
}

export default new JSONPayloads()
