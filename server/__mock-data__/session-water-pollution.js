const session = JSON.parse('{"water-pollution/water-feature":[{"questionId":500,"questionAsked":"In what kind of water is the pollution?","questionResponse":true,"answerId":506},{"questionId":500,"questionAsked":"In what kind of water is the pollution?","questionResponse":true,"answerId":508,"otherDetails":"this is a test"}],"water-pollution/less-than-10-metres":[{"questionId":700,"questionAsked":"Does the pollution spread less than 10 metres along the watercourse?","questionResponse":true,"answerId":702}],"water-pollution/pollution-length":[{"questionId":400,"questionAsked":"How far along the water feature does the pollution spread?","questionResponse":true,"answerId":403}],"water-pollution/other-information":"test","submission-timestamp":"2024-02-14T09:18:48.848Z"}')

const payload =
{
  reportingAnEnvironmentalProblem: {
    sessionGuid: 'fbeaf5ba-11bc-4478-942a-939fe0dc1e52',
    reportType: 100,
    datetimeObserved: '2024-02-14T09:41:26.283Z',
    datetimeReported: '2024-02-14T09:41:26.283Z',
    otherDetails: 'test',
    questionSetId: 100,
    data: [{
      questionId: 500,
      questionAsked: 'In what kind of water is the pollution?',
      questionResponse: true,
      answerId: 506
    }, {
      questionId: 500,
      questionAsked: 'In what kind of water is the pollution?',
      questionResponse: true,
      answerId: 508,
      otherDetails: 'this is a test'
    }, {
      questionId: 700,
      questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
      questionResponse: true,
      answerId: 702
    }, {
      questionId: 400,
      questionAsked: 'How far along the water feature does the pollution spread?',
      questionResponse: true,
      answerId: 403
    }]
  }
}

export {
  session,
  payload
}
