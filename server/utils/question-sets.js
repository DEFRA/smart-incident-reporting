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
          youDoNotKnow: {
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
          youDoNotKnow: {
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
          youDoNotKnow: {
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
      },
      WATER_POLLUTION_POLLUTION_WIDTH: {
        questionId: 1100,
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_WIDTH,
        text: 'Is the pollution across the full width of the watercourse?',
        answers: {
          yes: {
            answerId: 1101,
            text: 'Yes'
          },
          no: {
            answerId: 1102,
            text: 'No'
          },
          youDoNotKnow: {
            answerId: 1103,
            text: YOU_DO_NOT_KNOW
          }
        }
      }
    }
  },
  SMELL: {
    questionSetId: 200,
    questions: {
      SMELL_LOCATION_OPTION: {
        questionId: 100,
        key: constants.redisKeys.SMELL_OPTION,
        text: 'Where can you notice the smell?',
        answers: {
          address: {
            answerId: 101,
            text: 'Give an address'
          },
          description: {
            answerId: 102,
            text: 'Describe the location'
          }
        }
      },
      SMELL_LOCATION_DESCRIPTION: {
        questionId: 100,
        key: constants.redisKeys.SMELL_LOCATION_DESCRIPTION,
        text: 'Describe where you\'ve noticed the smell',
        answers: {
          locationDetails: {
            answerId: 101
          }
        }
      },
      SMELL_LOCATION_ADDRESS: {
        questionId: 100,
        key: constants.redisKeys.SMELL_LOCATION_ADDRESS,
        text: 'Enter the address',
        answers: {
          addressLine1: {
            answerId: 101,
            text: 'Address line 1'
          },
          addressLine2: {
            answerId: 102,
            text: 'Address line 2 (optional)'
          },
          townOrCity: {
            answerId: 103,
            text: 'Town or city'
          },
          county: {
            answerId: 104,
            text: 'County (optional)'
          },
          postcode: {
            answerId: 105,
            text: 'Postcode'
          },
          homeAddress: {
            answerId: 106,
            text: 'This is your home address'
          }
        }
      },
      SMELL_SOURCE: {
        questionId: 100,
        key: constants.redisKeys.SMELL_SOURCE,
        text: 'Do you know where the smell is coming from?',
        answers: {
          yes: {
            answerId: 101,
            text: 'Yes'
          },
          no: {
            answerId: 102,
            text: 'No'
          },
          yesDetails: {
            answerId: 103,
            text: 'Give as many details about the source of the smell as you can, including an address if known.'
          }
        }
      },
      SMELL_DESCRIPTION: {
        questionId: 100,
        key: constants.redisKeys.SMELL_DESCRIPTION,
        text: 'How would you describe the smell?',
        answers: {
          sewage: {
            answerId: 101,
            text: 'Sewage'
          },
          rubbish: {
            answerId: 102,
            text: 'Rubbish or refuse'
          },
          burning: {
            answerId: 103,
            text: 'Burning or smoke'
          },
          chemical: {
            answerId: 104,
            text: 'Gas or petrol'
          },
          rural: {
            answerId: 105,
            text: 'Agricultural, for example from muck spreading'
          },
          other: {
            answerId: 106,
            text: 'Something else'
          },
          otherDetail: {
            answerId: 107,
            text: 'Describe the smell'
          },
          youCannotDescribeIt: {
            answerId: 108,
            text: 'You cannot describe it'
          }
        }
      },
      SMELL_PREVIOUSLY_REPORTED: {
        questionId: 100,
        key: constants.redisKeys.SMELL_PREVIOUSLY_REPORTED,
        text: 'Have you reported the smell before?',
        answers: {
          yes: {
            answerId: 101,
            text: 'Yes'
          },
          no: {
            answerId: 102,
            text: 'No, this is the first time'
          }
        }
      },
      SMELL_RECURRING_PROBLEM: {
        questionId: 100,
        key: constants.redisKeys.SMELL_RECURRING_PROBLEM,
        text: 'Has the same smell caused you a problem before?',
        answers: {
          yes: {
            answerId: 101,
            text: 'Yes, regularly'
          },
          occasionally: {
            answerId: 102,
            text: 'Yes, not and then'
          },
          no: {
            answerId: 103,
            text: 'No, this is the first time'
          }
        }
      },
      SMELL_PAST: {
        questionId: 100,
        key: constants.redisKeys.SMELL_PAST,
        text: 'How long has the smell been causing problems?',
        answers: {
          howLong: {
            answerId: 101
          }
        }
      },
      SMELL_ONGOING: {
        questionId: 100,
        key: constants.redisKeys.SMELL_ONGOING,
        text: 'Is the smell still there?',
        answers: {
          yes: {
            answerId: 101,
            text: 'Yes'
          },
          no: {
            answerId: 102,
            text: 'No, it\'s gone now'
          }
        }
      },
      SMELL_STRENGTH: {
        questionId: 100,
        key: constants.redisKeys.SMELL_STRENGTH,
        text: 'How strong is the smell?',
        answers: {
          strong: {
            answerId: 101,
            text: 'You can smell it when breathing normally'
          },
          persistent: {
            answerId: 102,
            text: 'You notice it if you breathe in deeply'
          },
          faint: {
            answerId: 103,
            text: 'It is quite faint'
          },
          veryFaint: {
            answerId: 104,
            text: 'It is very faint - you can only notice it if you try'
          }
        }
      },
      SMELL_EFFECT_ON_ACTIVITY: {
        questionId: 100,
        key: constants.redisKeys.SMELL_EFFECT_ON_ACTIVITY,
        text: 'Has the smell stopped you from doing any of the following?',
        answers: {
          goingOutside: {
            answerId: 101,
            text: 'Using parts of your own property, including your garden'
          },
          leavingHome: {
            answerId: 102,
            text: 'Going out of your house, for example going to the shops'
          },
          goingElsewhere: {
            answerId: 103,
            text: 'Going to an event, for example a football match or concert'
          },
          noImpact: {
            answerId: 104,
            text: 'None of these'
          },
          otherDetails: {
            answerId: 105,
            text: 'Give details of the event'
          }
        }
      },
      SMELL_EFFECT_ON_DAILY_LIFE: {
        questionId: 100,
        key: constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE,
        text: 'Have any of the following happened?',
        answers: {
          cover: {
            answerId: 101,
            text: 'You had to cover your face or nose'
          },
          clothes: {
            answerId: 102,
            text: 'The smell stuck to your clothers or hair'
          },
          windows: {
            answerId: 103,
            text: 'You had to keep your windows and doors closed'
          },
          leaveArea: {
            answerId: 104,
            text: 'You had to move out of your home because of the smell'
          },
          other: {
            answerId: 105,
            text: 'Something else'
          },
          noActions: {
            answerId: 105,
            text: 'None of these'
          },
          otherDetails: {
            answerId: 106,
            text: 'Describe what happened'
          }
        }
      },
      SMELL_EFFECT_ON_HEALTH: {
        questionId: 100,
        key: constants.redisKeys.SMELL_EFFECT_ON_HEALTH,
        text: 'Did the smell cause any of the following?',
        answers: {
          headache: {
            answerId: 101,
            text: 'Headache'
          },
          wateringEyes: {
            answerId: 102,
            text: 'Watering eyes'
          },
          sick: {
            answerId: 103,
            text: 'Sickness or nausea'
          },
          vomit: {
            answerId: 104,
            text: 'Vomiting'
          },
          other: {
            answerId: 105,
            text: 'Something else'
          },
          noSymptoms: {
            answerId: 106,
            text: 'None of these'
          },
          otherDetails: {
            answerId: 107,
            text: 'Describe what happened'
          }
        }
      }
    }
  },
  ILLEGAL_FISHING: {
    questionSetId: 300,
    questions: {}
  },
  FLOODING: {
    questionSetId: 400,
    questions: {}
  }
}

export {
  questionSets
}
