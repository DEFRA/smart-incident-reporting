const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const phoneRegex = /^[\d-+()#]*$/

// Notices
const ACCESSIBILITY = 'notices/accessibility'
const COOKIES = 'notices/cookies'
const PRIVACY = 'notices/privacy'

const ERROR = 'error'
const PUBLIC = 'public'
const HOME = 'home'
const REPORT_SENT = 'report-sent'

const WATER_POLUTION = 'water-pollution'
const WATER_POLLUTION_WATER_FEATURE = 'water-pollution/water-feature'
const WATER_POLLUTION_LESS_THAN_10_METRES = 'water-pollution/less-than-10-metres'
const WATER_POLLUTION_LESS_THAN_100_SQ_METRES = 'water-pollution/less-than-100-sq-metres'
const WATER_POLLUTION_POLLUTION_AREA = 'water-pollution/pollution-area'
const WATER_POLLUTION_POLLUTION_LENGTH = 'water-pollution/pollution-length'
const WATER_POLLUTION_OTHER_INFORMATION = 'water-pollution/other-information'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'

// Common phrases
const YOU_DO_NOT_KNOW = 'You do not know'

const views = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  ERROR,
  PUBLIC,
  HOME,
  REPORT_SENT,
  WATER_POLUTION,
  WATER_POLLUTION_WATER_FEATURE,
  WATER_POLLUTION_LESS_THAN_10_METRES,
  WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
  WATER_POLLUTION_POLLUTION_AREA,
  WATER_POLLUTION_POLLUTION_LENGTH,
  WATER_POLLUTION_OTHER_INFORMATION
}

const routes = {
  ...views
}

for (const [key, value] of Object.entries(views)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...views,
  SUBMISSION_TIMESTAMP
}

const statusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  REDIRECT: 302,
  UNAUTHORIZED: 401,
  PAGE_NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  PAYLOAD_TOO_LARGE: 413,
  PROBLEM_WITH_SERVICE: 500,
  SERVICE_UNAVAILABLE: 503
}

const errorSummary = {
  titleText: 'There is a problem',
  errorList: []
}

const waterFeatureLabels = {
  501: 'river',
  504: 'canal',
  505: 'watercourse',
  506: 'watercourse',
  507: 'watercourse'
}

const questions = {
  WATER_POLLUTION_WATER_FEATURE: {
    questionId: 500,
    text: 'In what kind of water is the pollution?',
    answers: {
      river: {
        answerId: 501,
        text: 'A river'
      },
      lakeOrReservoir: {
        answerId: 502,
        text: 'A lake or reservoir'
      },
      sea: {
        answerId: 503,
        text: 'The sea'
      },
      canal: {
        answerId: 504,
        text: 'A canal'
      },
      smallWatercourse: {
        answerId: 505,
        text: 'A smaller stream or watercourse'
      },
      somethingElse: {
        answerId: 506,
        text: 'Something else'
      },
      doNotKnow: {
        answerId: 507,
        text: YOU_DO_NOT_KNOW
      },
      somethingElseDetails: {
        answerId: 508
      }
    }
  },
  WATER_POLLUTION_LESS_THAN_10_METRES: {
    questionId: 700,
    text: 'Does the pollution spread less than 10 metres along the watercourse?',
    answers: {
      yes: {
        answerId: 701,
        text: 'Yes'
      },
      no: {
        answerId: 702,
        text: 'No, it is over a longer stretch'
      },
      doNotKnow: {
        answerId: 703,
        text: YOU_DO_NOT_KNOW
      }
    }
  },
  WATER_POLLUTION_LESS_THAN_100_SQ_METRES: {
    questionId: 800,
    text: 'Does the pollution cover an area less than 100 square metres in size?',
    answers: {
      yes: {
        answerId: 801,
        text: 'Yes'
      },
      no: {
        answerId: 802,
        text: 'No, it spreads over a larger area'
      },
      doNotKnow: {
        answerId: 803,
        text: YOU_DO_NOT_KNOW
      }
    }
  },
  WATER_POLLUTION_POLLUTION_LENGTH: {
    questionId: 400,
    text: 'How far along the water feature does the pollution spread?',
    answers: {
      stretches10to100m: {
        answerId: 401,
        text: '10 to 100 metres (less than 2 minutes average walk)'
      },
      stretches100to500m: {
        answerId: 402,
        text: '100 to 500 metres (around 2 to 8 minutes walk)'
      },
      stretches500to1000m: {
        answerId: 403,
        text: '500 metres to a kilometre (around 8 to 16 minutes walk)'
      },
      over1km: {
        answerId: 404,
        text: 'Over a kilometre'
      },
      youDoNotKnow: {
        answerId: 405,
        text: YOU_DO_NOT_KNOW
      }
    }
  },
  WATER_POLLUTION_POLLUTION_AREA: {
    questionId: 300,
    text: 'How large an area does the pollution cover?',
    answers: {
      under500sqm: {
        answerId: 301,
        text: '100 to 500 square metres (sq m)'
      },
      over500sqm: {
        answerId: 302,
        text: 'More than 500 sq m'
      },
      youDoNotKnow: {
        answerId: 303,
        text: YOU_DO_NOT_KNOW
      }
    }
  }
}

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys,
  errorSummary,
  phoneRegex,
  questions,
  waterFeatureLabels
})
