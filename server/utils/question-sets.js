import constants from './constants.js'

// Common phrases
const YOU_DO_NOT_KNOW = 'You do not know'

const questionSets = {
  WATER_POLLUTION: {
    questionSetId: 100,
    questions: {
      WATER_POLLUTION_WATER_FEATURE: {
        questionId: 500,
        key: constants.redisKeys.WATER_POLLUTION_WATER_FEATURE,
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
        key: constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES,
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
        key: constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
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
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH,
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
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA,
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
      },
      WATER_POLLUTION_POLLUTION_APPEARANCE: {
        questionId: 1000,
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE,
        text: 'What does the pollution look like?',
        answers: {
          cloudy: {
            answerId: 1002,
            text: 'Cloudy or grey water'
          },
          rainbow: {
            answerId: 1001,
            text: 'A \'rainbow\' film on top of the water'
          },
          scum: {
            answerId: 1003,
            text: 'A foam or scum'
          },
          somethingElse: {
            answerId: 1004,
            text: 'Something else'
          },
          somethingElseDetail: {
            answerId: 1005,
            text: 'Describe what you can see in or on the water'
          }
        }
      },
      WATER_POLLUTION_LOCATION_DESCRIPTION: {
        questionId: 900,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION,
        text: 'Where is the pollution?',
        answers: {
          locationDetails: {
            answerId: 901
          }
        }
      }
    }
  },
  ODOUR: {
    id: 200,
    questions: {}
  },
  ILLEGAL_FISHING: {
    id: 300,
    questions: {}
  },
  FLOODING: {
    id: 400,
    questions: {}
  }
}

export {
  questionSets
}
