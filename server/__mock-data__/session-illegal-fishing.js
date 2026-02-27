// The question and answer Ids will need updating once we get the data from backend team
import moment from 'moment'

const yesterday = moment().seconds(0).milliseconds(0).subtract(1, 'days')
const today = moment().seconds(0).milliseconds(0)

const session = JSON.parse(`{
  "illegal-fishing/contact-details": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterEmailAddress": "test@test.com"
  },
  "illegal-fishing/water-feature": [
    {
      "questionId": 500,
      "questionAsked": "In what kind of water have you seen illegal fishing?",
      "questionResponse": true,
      "answerId": 501
    },
    {
      "questionId": 500,
      "questionAsked": "In what kind of water have you seen illegal fishing?",
      "questionResponse": true,
      "answerId": 509,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/activity": [
    {
      "questionId": 4200,
      "questionAsked": "What illegal fishing activity do you want to report?",
      "questionResponse": true,
      "answerId": 4202
    },
    {
      "questionId": 4200,
      "questionAsked": "What illegal fishing activity do you want to report?",
      "questionResponse": true,
      "answerId": 4204
    },
    {
      "questionId": 4200,
      "questionAsked": "What illegal fishing activity do you want to report?",
      "questionResponse": true,
      "answerId": 4206
    },
    {
      "questionId": 4200,
      "questionAsked": "What illegal fishing activity do you want to report?",
      "questionResponse": true,
      "answerId": 4207,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/rod-licence": [
    {
      "questionId": 4210,
      "questionAsked": "How do you know the people fishing do not have a rod licence?",
      "questionResponse": true,
      "answerId": 4211,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/location-option": [
    {
      "questionId": 2600,
      "questionAsked": "How do you want to tell us where you've seen illegal fishing?",
      "questionResponse": true,
      "answerId": 2601
    }
  ],
  "illegal-fishing/location-description": [
    {
      "questionId": 900,
      "questionAsked": "Describe the location where you've seen illegal fishing?",
      "questionResponse": true,
      "answerId": 901,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/people-description": [
    {
      "questionId": 4250,
      "questionAsked": "Can you describe anyone involved?",
      "questionResponse": true,
      "answerId": 4251
    }
  ],
  "illegal-fishing/description-details": [
    {
      "questionId": 4260,
      "questionAsked": "Describe the people involved?",
      "questionResponse": true,
      "answerId": 4261,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/illegal-equipment": [
    {
      "questionId": 4240,
      "questionAsked": "What illegal equipment is being used?",
      "questionResponse": true,
      "answerId": 4241
    },
    {
      "questionId": 4240,
      "questionAsked": "What illegal equipment is being used?",
      "questionResponse": true,
      "answerId": 4243
    },
    {
      "questionId": 4240,
      "questionAsked": "What illegal equipment is being used?",
      "questionResponse": true,
      "answerId": 4245
    },
    {
      "questionId": 4240,
      "questionAsked": "What illegal equipment is being used?",
      "questionResponse": true,
      "answerId": 4247,
      "otherDetails": "test"
    }
  ],
  "illegal-fishing/type-of-fish": [
    {
      "questionId": 4230,
      "questionAsked": "What type of fish are being caught or targeted?",
      "questionResponse": true,
      "answerId": 4231
    },
    {
      "questionId": 4230,
      "questionAsked": "What type of fish are being caught or targeted?",
      "questionResponse": true,
      "answerId": 4233
    },
    {
      "questionId": 4230,
      "questionAsked": "What type of fish are being caught or targeted?",
      "questionResponse": true,
      "answerId": 4235
    }
  ],
  "illegal-fishing/fish-taken": [
    {
      "questionId": 4215,
      "questionAsked": "Did you see fish being 'taken'?",
      "questionResponse": true,
      "answerId": 4216
    }
  ],
  "illegal-fishing/number-of-fish": [
    {
      "questionId": 4220,
      "questionAsked": "How many fish?",
      "questionResponse": true,
      "answerId": 4221
    }
  ],
  "illegal-fishing/images-or-video": [
    {
      "questionId": 2800,
      "questionAsked": "Do you want to send us any images or videos of the pollution?",
      "questionResponse": true,
      "answerId": 2801
    }
  ],
  "illegal-fishing/angling-trust": [
    {
      "questionId": 4280,
      "questionAsked": "Are you an Angling Trust volunteer?",
      "questionResponse": true,
      "answerId": 4281
    }
  ],
  "illegal-fishing/other-information": "This is a description of the illegal fishing activity",
  "illegal-fishing/when": "${yesterday.toISOString()}",
  "submission-timestamp": "${today.toISOString()}"
}`)

export {
  session
}
