// The question and answer Ids will need updating once we get the data from backend team
import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)

const session = JSON.parse(`{
  "home": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterAccessCode": "password"
  },
  "smell/location-option": [
    {
      "questionId": 100,
      "questionAsked": "Where can you notice the smell?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/location-address": [
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 101,
      "otherDetails": "Test address 1"
    },
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 102,
      "otherDetails": "test address 2"
    },
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 103,
      "otherDetails": "city"
    },
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 104,
      "otherDetails": "county"
    },
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 105,
      "otherDetails": "M6 7PW"
    },
    {
      "questionId": 100,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 106
    }
  ],
  "smell/smell-source": [
    {
      "questionId": 100,
      "questionAsked": "Do you know where the smell is coming from?",
      "questionResponse": true,
      "answerId": 101
    },
    {
      "questionId": 100,
      "questionAsked": "Do you know where the smell is coming from?",
      "questionResponse": true,
      "answerId": 103,
      "otherDetails": "test"
    }
  ],
  "smell/smell-description": [
    {
      "questionId": 100,
      "questionAsked": "How would you describe the smell?",
      "questionResponse": true,
      "answerId": 101
    },
    {
      "questionId": 100,
      "questionAsked": "How would you describe the smell?",
      "questionResponse": true,
      "answerId": 103
    }
  ],
  "smell/previously-reported": [
    {
      "questionId": 100,
      "questionAsked": "Have you reported the smell before?",
      "questionResponse": true,
      "answerId": 102
    }
  ],
  "smell/recurring-problem": [
    {
      "questionId": 100,
      "questionAsked": "Has the same smell caused you a problem before?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/past": [
    {
      "questionId": 100,
      "questionAsked": "How long has the smell been causing problems?",
      "questionResponse": true,
      "answerId": 101,
      "otherDetails": "test"
    }
  ],
  "smell/ongoing": [
    {
      "questionId": 100,
      "questionAsked": "Is the smell still there?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/smell-strength": [
    {
      "questionId": 100,
      "questionAsked": "How strong is the smell?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/effect-on-activity": [
    {
      "questionId": 100,
      "questionAsked": "Has the smell stopped you from doing any of the following?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/effect-on-daily-life": [
    {
      "questionId": 100,
      "questionAsked": "Have any of the following happened?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/effect-on-health": [
    {
      "questionId": 100,
      "questionAsked": "Did the smell cause any of the following?",
      "questionResponse": true,
      "answerId": 101
    }
  ],
  "smell/other-information": "test",
  "smell/date-time": "${yesterday.toISOString()}",
  "submission-timestamp": "${today.toISOString()}"
}`)

const payload =
{
  reportingAnEnvironmentalProblem: {
    sessionGuid: 'fbeaf5ba-11bc-4478-942a-939fe0dc1e52',
    reportType: 200,
    datetimeObserved: yesterday.toISOString(),
    datetimeReported: today.toISOString(),
    reporterName: 'John Smith',
    reporterPhoneNumber: '012345678910',
    reporterAccessCode: 'password',
    otherDetails: 'test',
    questionSetId: 200,
    data: [{ questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 101, otherDetails: 'Test address 1' },
      { questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 102, otherDetails: 'test address 2' },
      { questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 103, otherDetails: 'city' },
      { questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 104, otherDetails: 'county' },
      { questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 105, otherDetails: 'M6 7PW' },
      { questionId: 100, questionAsked: 'Enter the address', questionResponse: true, answerId: 106 },
      { questionId: 100, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 103, otherDetails: 'test' },
      { questionId: 100, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 103 },
      { questionId: 100, questionAsked: 'Have you reported the smell before?', questionResponse: true, answerId: 102 },
      { questionId: 100, questionAsked: 'Has the same smell caused you a problem before?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'How long has the smell been causing problems?', questionResponse: true, answerId: 101, otherDetails: 'test' },
      { questionId: 100, questionAsked: 'Is the smell still there?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'How strong is the smell?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'Has the smell stopped you from doing any of the following?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'Have any of the following happened?', questionResponse: true, answerId: 101 },
      { questionId: 100, questionAsked: 'Did the smell cause any of the following?', questionResponse: true, answerId: 101 }
    ]
  }
}

export {
  session,
  payload
}
