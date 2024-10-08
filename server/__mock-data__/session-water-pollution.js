import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)
const pollutionSubstance = 'What do you think the pollution is?'

const session = JSON.parse(`{
  "home": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterEmailAddress": "test@test.com",
    "reporterAccessCode": "password"
  },
  "water-pollution/water-feature": [ 
    {
      "questionId": 500,
      "questionAsked": "In what kind of water is the pollution?",
      "questionResponse": true,
      "answerId": 506
    },
    {
      "questionId": 500,
      "questionAsked": "In what kind of water is the pollution?",
      "questionResponse": true,
      "answerId": 508,
      "otherDetails": "this is a test"
    }
  ],
  "water-pollution/less-than-10-metres": [
    {
      "questionId": 700,
      "questionAsked": "Does the pollution spread less than 10 metres along the watercourse?",
      "questionResponse": true,
      "answerId": 702
    }
  ],
  "water-pollution/pollution-length": [
    {
      "questionId": 400,
      "questionAsked": "How far along the water feature does the pollution spread?",
      "questionResponse": true,
      "answerId": 403
    }
  ],
  "water-pollution/location-description": [
    {
      "questionId": 900,
      "questionAsked": "Where is the pollution?",
      "questionResponse": true,
      "answerId": 901,
      "otherDetails": "test location"
    }
  ],
  "water-pollution/pollution-appearance": [
    {
      "questionId": 1000,
      "questionAsked": "What does the pollution look like?",
      "questionResponse": true,
      "answerId": 1002
    },
    {
      "questionId": 1000,
      "questionAsked": "What does the pollution look like?",
      "questionResponse": true,
      "answerId": 1003
    }
  ],
  "water-pollution/pollution-width": [
    {
      "questionId": 1100,
      "questionAsked": "Is the pollution across the full width of the watercourse?",
      "questionResponse": true,
      "answerId": 1101
    }
  ],
  "water-pollution/images-or-video": [
    {
      "questionId": 2800,
      "questionAsked": "Do you want to send us any images or videos of the pollution?",
      "questionResponse": true,
      "answerId": 2801
    }
  ],
  "water-pollution/pollution-substance": [
    {
      "questionId": 2900,
      "questionAsked": "What do you think the pollution is?",
      "questionResponse": true,
      "answerId": 2901
    },
    {
      "questionId": 2900,
      "questionAsked": "What do you think the pollution is?",
      "questionResponse": true,
      "answerId": 2905
    },
    {
      "questionId": 2900,
      "questionAsked": "What do you think the pollution is?",
      "questionResponse": true,
      "answerId": 2907,
      "otherDetails": "other details"
    } 
  ],
  "water-pollution/source": [
    {
      "questionId": 100,
      "questionAsked": "Do you know where the pollution is coming from?",
      "questionResponse": true,
      "answerId": 101
    }, {
      "questionId": 100,
      "questionAsked": "Do you know where the pollution is coming from?",
      "questionResponse": true,
      "answerId": 103,
      "otherDetails": "other details"
    }
  ],
  "water-pollution/other-information": "test",
  "water-pollution/when": "${yesterday.toISOString()}",
  "submission-timestamp": "${today.toISOString()}"
}`)

const payload =
{
  reportingAnEnvironmentalProblem: {
    sessionGuid: 'fbeaf5ba-11bc-4478-942a-939fe0dc1e52',
    reportType: 100,
    datetimeObserved: yesterday.toISOString(),
    datetimeReported: today.toISOString(),
    reporterName: 'John Smith',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com',
    reporterAccessCode: 'password',
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
    }, {
      questionId: 900,
      questionAsked: 'Where is the pollution?',
      questionResponse: true,
      answerId: 901,
      otherDetails: 'test location'
    }, {
      questionId: 1000,
      questionAsked: 'What does the pollution look like?',
      questionResponse: true,
      answerId: 1002
    }, {
      questionId: 1000,
      questionAsked: 'What does the pollution look like?',
      questionResponse: true,
      answerId: 1003
    }, {
      questionId: 1100,
      questionAsked: 'Is the pollution across the full width of the river?',
      questionResponse: true,
      answerId: 1101
    }, {
      questionId: 2800,
      questionAsked: 'Do you want to send us any images or videos of the pollution?',
      questionResponse: true,
      answerId: 2801
    }, {
      questionId: 2900,
      questionAsked: pollutionSubstance,
      questionResponse: true,
      answerId: 2901
    }, {
      questionId: 2900,
      questionAsked: pollutionSubstance,
      questionResponse: true,
      answerId: 2905
    }, {
      questionId: 2900,
      questionAsked: pollutionSubstance,
      questionResponse: true,
      answerId: 2907,
      otherDetails: 'other details'
    }, {
      questionId: 100,
      questionAsked: 'Do you know where the pollution is coming from?',
      questionResponse: true,
      answerId: 101
    }, {
      questionId: 100,
      questionAsked: 'Do you know where the pollution is coming from?',
      questionResponse: true,
      answerId: 103,
      otherDetails: 'other details'
    }]
  }
}

export {
  session,
  payload
}
