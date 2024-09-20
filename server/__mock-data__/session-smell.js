// The question and answer Ids will need updating once we get the data from backend team
import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)

const session = JSON.parse(`{
  "home": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterEmailAddress": "test@test.com",
    "reporterAccessCode": "password"
  },
  "smell/source": [
    {
      "questionId": 1600,
      "questionAsked": "Where is the smell coming from?",
      "questionResponse": true,
      "answerId": 1601
    }
  ],
  "smell/source-details": [
    {
      "questionId": 32000,
      "questionAsked": "Can you give details about where the smell is coming from?",
      "questionResponse": true,
      "answerId": 32002,
      "otherDetails": "test"
    },
    {
      "questionId": 32000,
      "questionAsked": "Can you give details about where the smell is coming from?",
      "questionResponse": true,
      "answerId": 32003,
      "otherDetails": "test"
    },
    {
      "questionId": 32000,
      "questionAsked": "Can you give details about where the smell is coming from?",
      "questionResponse": true,
      "answerId": 32004,
      "otherDetails": "test"
    },
    {
      "questionId": 32000,
      "questionAsked": "Can you give details about where the smell is coming from?",
      "questionResponse": true,
      "answerId": 32005,
      "otherDetails": "m11mm"
    }
  ],
  "smell/location-home": [
    {
      "questionId": 3100,
      "questionAsked": "Is the smell affecting you at home?",
      "questionResponse": true,
      "answerId": 30001
    }
  ],
  "smell/location-address": [
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1401,
      "otherDetails": "address 1"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1402,
      "otherDetails": "address 2"
    },
    {
      "questionId": 1400,
      "questionAsked": "Enter the address",
      "questionResponse": true,
      "answerId": 1403,
      "otherDetails": "town"
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
      "otherDetails": "m11mm"
    }
  ],
  "smell/previous": [
    {
      "questionId": 1900,
      "questionAsked": "Has this smell caused you problems before?",
      "questionResponse": true,
      "answerId": 1901
    }
  ],
  "smell/current": [
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
      "answerId": 2203
    }
  ],
  "smell/indoors": [
    {
      "questionId": 3000,
      "questionAsked": "Is the smell noticeable indoors?",
      "questionResponse": true,
      "answerId": 30001
    }
  ],
  "smell/contact": [
    {
      "questionId": 1,
      "questionAsked": "Can we contact you for more information if needed?",
      "questionResponse": true,
      "answerId": 2
    }
  ],
  "smell/images-or-video": [
    {
      "questionId": 1,
      "questionAsked": "Do you want to send us any images or videos of the problem?",
      "questionResponse": true,
      "answerId": 2
    }
  ],
  "smell/other-information": "This is a description of the odour",
  "smell/start-date-time": "${yesterday.toISOString()}",
  "submission-timestamp": "${today.toISOString()}"
}`)

export {
  session
}
