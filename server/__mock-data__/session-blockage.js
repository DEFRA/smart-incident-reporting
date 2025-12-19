import moment from 'moment'

const session = JSON.parse(`{
  "blockage/contact-details": {
    "reporterName": "John Smith",
    "reporterPhoneNumber": "012345678910",
    "reporterEmailAddress": "test@test.com"
  },
  "blockage/river": [
    {
      "questionId": 5000,
      "questionAsked": "Is the blockage in a river?",
      "questionResponse": true,
      "answerId": 5001
    }
  ],
  "blockage/river-name": [
    {
      "questionId": 500,
      "questionAsked": "Do you know the name of the river?",
      "questionResponse": true,
      "answerId": 501
    },
    {
      "questionId": 500,
      "questionAsked": "Do you know the name of the river?",
      "questionResponse": true,
      "answerId": 509,
      "otherDetails": "River Thames"
    }
  ],
  "blockage/blockage-type": [
    {
      "questionId": 110,
      "questionAsked": "What's blocking the river?",
      "questionResponse": true,
      "answerId": 111
    }
  ],
  "blockage/location-option": [
    {
      "questionId": 2600,
      "questionAsked": "How do you want to tell us where the blockage is?",
      "questionResponse": true,
      "answerId": 2601
    }
  ],
  "blockage/location-description": [
    {
      "questionId": 900,
      "questionAsked": "Location description",
      "questionResponse": true,
      "answerId": 901,
      "otherDetails": "Near the bridge on High Street"
    }
  ],
  "blockage/history": [
    {
      "questionId": 120,
      "questionAsked": "Has the blockage been here for some time?",
      "questionResponse": true,
      "answerId": 121
    },
    {
      "questionId": 120,
      "questionAsked": "Has the blockage been here for some time?",
      "questionResponse": true,
      "answerId": 124,
      "otherDetails": "About 2 weeks"
    }
  ],
  "blockage/extent": [
    {
      "questionId": 130,
      "questionAsked": "How much of the river is blocked?",
      "questionResponse": true,
      "answerId": 131
    }
  ],
  "blockage/water-level": [
    {
      "questionId": 140,
      "questionAsked": "Is water building up behind the blockage?",
      "questionResponse": true,
      "answerId": 141
    }
  ],
  "blockage/flood-risk": [
    {
      "questionId": 150,
      "questionAsked": "Will the blockage cause a flood if it is not removed?",
      "questionResponse": true,
      "answerId": 152
    }
  ],
  "blockage/owner": [
    {
      "questionId": 180,
      "questionAsked": "Do you know who is responsible for causing the blockage?",
      "questionResponse": true,
      "answerId": 181
    },
    {
      "questionId": 180,
      "questionAsked": "Do you know who is responsible for causing the blockage?",
      "questionResponse": true,
      "answerId": 183,
      "otherDetails": "Local construction company"
    }
  ],
  "blockage/when": "${moment().toISOString()}"
}`)

export { session }
