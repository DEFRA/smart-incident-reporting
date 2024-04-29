// The question and answer Ids will need updating once we get the data from backend team
import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)
const enterTheAddress = 'Enter the address'

const session = JSON.parse(`{
  "home": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterAccessCode": "password"
  },
  "smell/location-option": [
    {
      "questionId": 1200,
      "questionAsked": "Where can you notice the smell?",
      "questionResponse": true,
      "answerId": 1201
    }
  ],
  "smell/location-address": [
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1401,
      "otherDetails": "Test address 1"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1402,
      "otherDetails": "test address 2"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1403,
      "otherDetails": "city"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1404,
      "otherDetails": "county"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1405,
      "otherDetails": "M6 7PW"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1406
    }
  ],
  "smell/smell-source": [
    {
      "questionId": 1600,
      "questionAsked": "Do you know where the smell is coming from?",
      "questionResponse": true,
      "answerId": 1601
    },
    {
      "questionId": 1600,
      "questionAsked": "Do you know where the smell is coming from?",
      "questionResponse": true,
      "answerId": 1603,
      "otherDetails": "test"
    }
  ],
  "smell/smell-description": [
    {
      "questionId": 1700,
      "questionAsked": "How would you describe the smell?",
      "questionResponse": true,
      "answerId": 1701
    },
    {
      "questionId": 1700,
      "questionAsked": "How would you describe the smell?",
      "questionResponse": true,
      "answerId": 1703
    }
  ],
  "smell/previously-reported": [
    {
      "questionId": 1800,
      "questionAsked": "Have you reported the smell before?",
      "questionResponse": true,
      "answerId": 1802
    }
  ],
  "smell/recurring-problem": [
    {
      "questionId": 1900,
      "questionAsked": "Has the same smell caused you a problem before?",
      "questionResponse": true,
      "answerId": 1901
    }
  ],
  "smell/past": [
    {
      "questionId": 2000,
      "questionAsked": "How long has the smell been causing problems?",
      "questionResponse": true,
      "answerId": 2001,
      "otherDetails": "test"
    }
  ],
  "smell/ongoing": [
    {
      "questionId": 2100,
      "questionAsked": "Is the smell still there?",
      "questionResponse": true,
      "answerId": 2101
    }
  ],
  "smell/smell-strength": [
    {
      "questionId": 2200,
      "questionAsked": "How strong is the smell?",
      "questionResponse": true,
      "answerId": 2201
    }
  ],
  "smell/effect-on-activity": [
    {
      "questionId": 2300,
      "questionAsked": "Has the smell stopped you from doing any of the following?",
      "questionResponse": true,
      "answerId": 2301
    }
  ],
  "smell/effect-on-daily-life": [
    {
      "questionId": 2400,
      "questionAsked": "Have any of the following happened?",
      "questionResponse": true,
      "answerId": 2401
    }
  ],
  "smell/effect-on-health": [
    {
      "questionId": 2500,
      "questionAsked": "Did the smell cause any of the following?",
      "questionResponse": true,
      "answerId": 2501
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
    data: [{ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1401, otherDetails: 'Test address 1' },
      { questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1402, otherDetails: 'test address 2' },
      { questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1403, otherDetails: 'city' },
      { questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1404, otherDetails: 'county' },
      { questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1405, otherDetails: 'M6 7PW' },
      { questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1406 },
      { questionId: 1600, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 1601 },
      { questionId: 1600, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 1603, otherDetails: 'test' },
      { questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1701 },
      { questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1703 },
      { questionId: 1800, questionAsked: 'Have you reported the smell before?', questionResponse: true, answerId: 1802 },
      { questionId: 1900, questionAsked: 'Has the same smell caused you a problem before?', questionResponse: true, answerId: 1901 },
      { questionId: 2000, questionAsked: 'How long has the smell been causing problems?', questionResponse: true, answerId: 2001, otherDetails: 'test' },
      { questionId: 2100, questionAsked: 'Is the smell still there?', questionResponse: true, answerId: 2101 },
      { questionId: 2200, questionAsked: 'How strong is the smell?', questionResponse: true, answerId: 2201 },
      { questionId: 2300, questionAsked: 'Has the smell stopped you from doing any of the following?', questionResponse: true, answerId: 2301 },
      { questionId: 2400, questionAsked: 'Have any of the following happened?', questionResponse: true, answerId: 2401 },
      { questionId: 2500, questionAsked: 'Did the smell cause any of the following?', questionResponse: true, answerId: 2501 }
    ]
  }
}

export {
  session,
  payload
}
