// The question and answer Ids will need updating once we get the data from backend team
import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)

const session = JSON.parse(`{
  "rars/contact-details": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterEmailAddress": "test@test.com"
  },
  "rars/source": [
    {
      "questionId": 1600,
      "questionAsked": "Where is the problem coming from?",
      "questionResponse": true,
      "answerId": 1601
    }
  ],
  "rars/source-details": [
    {
      "questionId": 3200,
      "questionAsked": "Do you know the site or business responsible for the problem?",
      "questionResponse": true,
      "answerId": 3202,
      "otherDetails": "test"
    }
  ],
  "rars/location-home": [
    {
      "questionId": 3100,
      "questionAsked": "Where is the problem causing a problem?",
      "questionResponse": true,
      "answerId": 3101
    }
  ],
  "rars/location-option": [
    {
      "questionId": 2600,
      "questionAsked": "How do you want to tell us where the problem is?",
      "questionResponse": true,
      "answerId": 2601
    }
  ],
  "rars/location-description": [
    {
      "questionId": 1500,
      "questionAsked": "Describe the location",
      "questionResponse": true,
      "answerId": 1501,
      "otherDetails": "test"
    }
  ],
  "rars/recurring": [
    {
      "questionId": 1900,
      "questionAsked": "Has this happened before?",
      "questionResponse": true,
      "answerId": 1901
    }
  ],
  "rars/effect-on-daily-life": [
    {
      "questionId": 2400,
      "questionAsked": "Did you do any of the following because of the problem, on this occasion?",
      "questionResponse": true,
      "answerId": 2401
    }
  ],
  "rars/effect-on-health": [
    {
      "questionId": 2500,
      "questionAsked": "Has the problem caused any of the following issues?",
      "questionResponse": true,
      "answerId": 2501
    }
  ],
  "rars/medical-help": [
    {
      "questionId": 3300,
      "questionAsked": "Have you had to get any medical help or treatment?",
      "questionResponse": true,
      "answerId": 3301
    }
  ],
  "rars/images-or-video": [
    {
      "questionId": 2800,
      "questionAsked": "Do you have any photos or videos to include?",
      "questionResponse": true,
      "answerId": 2801
    }
  ],
  "rars/when": "${yesterday.toISOString()}",
  "submission-timestamp": "${today.toISOString()}"
}`)

export {
  session
}
