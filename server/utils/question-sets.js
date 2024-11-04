import constants from './constants.js'

// Common phrases
const YOU_DO_NOT_KNOW = 'You do not know'
const SOMETHING_ELSE = 'Something else'
const NONE_OF_THESE = 'None of these'
const YOU_DO_NOT_KNOW_SHORT = 'Don\'t know'

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
            text: 'A river',
            shortText: 'River'
          },
          lakeOrReservoir: {
            answerId: 502,
            text: 'A lake or reservoir',
            shortText: 'Lake or reservoir'
          },
          sea: {
            answerId: 503,
            text: 'The sea',
            shortText: 'Sea'
          },
          canal: {
            answerId: 504,
            text: 'A canal',
            shortText: 'Canal'
          },
          smallWatercourse: {
            answerId: 505,
            text: 'A smaller stream or watercourse',
            shortText: 'Smaller stream or watercourse'
          },
          somethingElse: {
            answerId: 506,
            text: SOMETHING_ELSE,
            shortText: SOMETHING_ELSE
          },
          youDoNotKnow: {
            answerId: 507,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
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
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 702,
            text: 'No, it is over a longer stretch',
            shortText: 'No'
          },
          youDoNotKnow: {
            answerId: 703,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
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
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 802,
            text: 'No, it spreads over a larger area',
            shortText: 'No'
          },
          youDoNotKnow: {
            answerId: 803,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
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
            text: '10 to 100 metres (less than 2 minutes average walk)',
            shortText: '10 to 100 metres'
          },
          stretches100to500m: {
            answerId: 402,
            text: '100 to 500 metres (around 2 to 8 minutes walk)',
            shortText: '100 to 500 metres'
          },
          stretches500to1000m: {
            answerId: 403,
            text: '500 metres to a kilometre (around 8 to 16 minutes walk)',
            shortText: '500 metres to a kilometre'
          },
          over1km: {
            answerId: 404,
            text: 'Over a kilometre',
            shortText: 'Over a kilometre'
          },
          youDoNotKnow: {
            answerId: 405,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
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
            text: '100 to 500 square metres (sq m)',
            shortText: '100 to 500 square metres'
          },
          over500sqm: {
            answerId: 302,
            text: 'More than 500 sq m',
            shortText: 'More than 500 square metres'
          },
          youDoNotKnow: {
            answerId: 303,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
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
            text: 'Cloudy or grey water',
            shortText: 'Cloudy or grey water'
          },
          rainbow: {
            answerId: 1001,
            text: 'A \'rainbow\' film on top of the water',
            shortText: 'A rainbow film'
          },
          scum: {
            answerId: 1003,
            text: 'A foam or scum',
            shortText: 'Foam or scum'
          },
          somethingElse: {
            answerId: 1004,
            text: SOMETHING_ELSE,
            shortText: SOMETHING_ELSE
          },
          somethingElseDetail: {
            answerId: 1005,
            text: 'Describe what you can see in or on the water'
          }
        }
      },
      WATER_POLLUTION_SOURCE: {
        questionId: 100,
        key: constants.redisKeys.WATER_POLLUTION_SOURCE,
        text: 'Do you know where the pollution is coming from?',
        answers: {
          yes: {
            answerId: 101,
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 102,
            text: 'No',
            shortText: 'No'
          },
          yesDetails: {
            answerId: 103,
            text: 'Give details about where the pollution is coming from'
          }
        }
      },
      WATER_POLLUTION_IMAGES_OR_VIDEO: {
        questionId: 2800,
        key: constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO,
        text: 'Do you want to send us any images or videos of the pollution?',
        answers: {
          yes: {
            answerId: 2801,
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 2802,
            text: 'No',
            shortText: 'No'
          }
        }
      },
      WATER_POLLUTION_LOCATION_OPTION: {
        questionId: 2600,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_OPTION,
        text: 'Where did you see the pollution?',
        answers: {
          map: {
            answerId: 2602,
            text: 'Mark the location on an online map'
          },
          description: {
            answerId: 2601,
            text: 'Describe the location'
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
      WATER_POLLUTION_LOCATION_MAP: {
        questionId: 2700,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_MAP,
        text: 'Mark the location of the pollution',
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          }
        }
      },
      WATER_POLLUTION_EFFECT_ON_WILDLIFE: {
        questionId: 200,
        key: constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE,
        text: 'Have you seen any dead or distressed fish or animals nearby?',
        answers: {
          yes: {
            answerId: 201,
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 202,
            text: 'No',
            shortText: 'No'
          },
          yesDetails: {
            answerId: 203,
            text: 'Give details about what you\'ve seen, including the type and number of fish or animals affected'
          }
        }
      },
      WATER_POLLUTION_POLLUTION_SUBSTANCE: {
        questionId: 2900,
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE,
        text: 'What do you think the pollution is?',
        answers: {
          sewage: {
            answerId: 2901,
            text: 'Sewage',
            shortText: 'Sewage'
          },
          chemical: {
            answerId: 2902,
            text: 'Oil or petrol',
            shortText: 'Oil or petrol'
          },
          rural: {
            answerId: 2903,
            text: 'Agricultural waste, for example from muck spreading',
            shortText: 'Agricultural waste'
          },
          refuse: {
            answerId: 2904,
            text: 'Rubbish or refuse',
            shortText: 'Rubbish or refuse'
          },
          somethingElse: {
            answerId: 2905,
            text: SOMETHING_ELSE,
            shortText: SOMETHING_ELSE
          },
          unknown: {
            answerId: 2906,
            text: YOU_DO_NOT_KNOW,
            shortText: YOU_DO_NOT_KNOW_SHORT
          },
          somethingElseDetail: {
            answerId: 2907,
            text: 'Give details of what you think is in the water'
          }
        }
      }
    }
  },
  SMELL: {
    questionSetId: 200,
    questions: {
      SMELL_SOURCE: {
        questionId: 1600,
        key: constants.redisKeys.SMELL_SOURCE,
        text: 'Where is the smell coming from?',
        answers: {
          wasteSite: {
            answerId: 1601,
            text: 'A waste site, for example a landfill or recycling centre'
          },
          industry: {
            answerId: 1602,
            text: 'A large industrial site, factory or business, for example a food processing plant'
          },
          sewage: {
            answerId: 1603,
            text: 'A sewage or water treatment works'
          },
          wasteSpreading: {
            answerId: 1604,
            text: 'Agricultural site or activity, for example muck spreading'
          },
          local: {
            answerId: 1605,
            text: 'A small local business, for example a restaurant'
          },
          neighbour: {
            answerId: 1606,
            text: 'A neighbouring property'
          },
          rubbish: {
            answerId: 1607,
            text: 'Household waste and rubbish'
          },
          unknown: {
            answerId: 1608,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      SMELL_SOURCE_DETAILS: {
        questionId: 3200,
        key: constants.redisKeys.SMELL_SOURCE_DETAILS,
        text: 'Can you give details about where the smell is coming from?',
        answers: {
          siteName: {
            answerId: 3202,
            text: 'Name of person or site'
          },
          sourceAddress: {
            answerId: 3203,
            text: 'Street name and number (if known)'
          },
          sourceTown: {
            answerId: 3204,
            text: 'Town or city'
          },
          sourcePostcode: {
            answerId: 3205,
            text: 'Postcode (if known)'
          }
        }
      },
      SMELL_LOCATION_HOME: {
        questionId: 3100,
        key: constants.redisKeys.SMELL_LOCATION_HOME,
        text: 'Is the smell affecting you at home?',
        answers: {
          yes: {
            answerId: 3101,
            text: 'Yes'
          },
          no: {
            answerId: 3102,
            text: 'No, somewhere else'
          }
        }
      },
      SMELL_LOCATION_ADDRESS: {
        questionId: 1400,
        key: constants.redisKeys.SMELL_LOCATION_ADDRESS,
        text: 'Enter the address',
        answers: {
          addressLine1: {
            answerId: 1401,
            text: 'Address line 1'
          },
          addressLine2: {
            answerId: 1402,
            text: 'Address line 2 (optional)'
          },
          townOrCity: {
            answerId: 1403,
            text: 'Town or city'
          },
          county: {
            answerId: 1404,
            text: 'County (optional)'
          },
          postcode: {
            answerId: 1405,
            text: 'Postcode'
          }
        }
      },
      SMELL_LOCATION_OPTION: {
        questionId: 1200,
        key: constants.redisKeys.SMELL_LOCATION_OPTION,
        text: 'How do you want to tell us where you\'ve noticed the smell?',
        answers: {
          map: {
            answerId: 1201,
            text: 'Mark the location on an online map'
          },
          description: {
            answerId: 1202,
            text: 'Describe the location'
          }
        }
      },
      SMELL_LOCATION_DESCRIPTION: {
        questionId: 1500,
        key: constants.redisKeys.SMELL_LOCATION_DESCRIPTION,
        text: 'Describe the location where you noticed the smell',
        answers: {
          locationDetails: {
            answerId: 1501
          }
        }
      },
      SMELL_PREVIOUS: {
        questionId: 1900,
        key: constants.redisKeys.SMELL_PREVIOUS,
        text: 'Has this smell caused you problems before?',
        answers: {
          yes: {
            answerId: 1901,
            text: 'Yes, it happens often'
          },
          occasionally: {
            answerId: 1902,
            text: 'Yes, now and then'
          },
          no: {
            answerId: 1903,
            text: 'No, this is the first time'
          }
        }
      },
      SMELL_LOCATION_MAP: {
        questionId: 2700,
        key: constants.redisKeys.SMELL_LOCATION_MAP,
        text: 'Mark the location of the smell',
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          }
        }
      },
      SMELL_CURRENT: {
        questionId: 2100,
        key: constants.redisKeys.SMELL_CURRENT,
        text: 'Is the smell still there?',
        answers: {
          yes: {
            answerId: 2101,
            text: 'Yes'
          },
          no: {
            answerId: 2102,
            text: 'No'
          }
        }
      },
      SMELL_SMELL_STRENGTH: {
        questionId: 2200,
        key: constants.redisKeys.SMELL_SMELL_STRENGTH,
        text: 'How strong is the smell?',
        answers: {
          faint: {
            answerId: 2201,
            text: 'Faint - a smell you notice occasionally or on the wind'
          },
          distinct: {
            answerId: 2202,
            text: 'Distinct - a smell you can notice when breathing normally'
          },
          strong: {
            answerId: 2203,
            text: 'Strong - a smell that\'s noticeable all the time, you cannot ignore it'
          },
          veryStrong: {
            answerId: 2204,
            text: 'Very strong - an unbearable smell you need to get away from'
          }
        }
      },
      SMELL_INDOORS: {
        questionId: 3000,
        key: constants.redisKeys.SMELL_INDOORS,
        text: 'Is the smell noticeable indoors?',
        answers: {
          yes: {
            answerId: 3001,
            text: 'Yes'
          },
          no: {
            answerId: 3002,
            text: 'No, you can only smell it outside'
          }
        }
      },
      SMELL_CLOTHING_AND_HAIR: {
        questionId: 3600,
        key: constants.redisKeys.SMELL_CLOTHING_AND_HAIR,
        text: 'Does the smell stick to your clothing or hair?',
        answers: {
          yes: {
            answerId: 3601,
            text: 'Yes'
          },
          no: {
            answerId: 3602,
            text: 'No'
          }
        }
      },
      SMELL_EFFECT_ON_DAILY_LIFE: {
        questionId: 2400,
        key: constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE,
        text: 'Did you do any of the following because of the smell?',
        answers: {
          leave: {
            answerId: 2401,
            text: 'Leave the area of the smell'
          },
          windows: {
            answerId: 2402,
            text: 'Keep windows or doors closed'
          },
          goingOutside: {
            answerId: 2403,
            text: 'Avoid using parts of your property, for example your garden'
          },
          goingElsewhere: {
            answerId: 2404,
            text: 'Put off doing something, for example going to the shops'
          },
          cancelEvent: {
            answerId: 2405,
            text: 'Cancel, or not attend an event or planned activity'
          },
          somethingElse: {
            answerId: 2406,
            text: SOMETHING_ELSE
          },
          noImpact: {
            answerId: 2407,
            text: NONE_OF_THESE
          },
          putOffDetails: {
            answerId: 2408,
            text: 'Give details about what you put off doing'
          },
          eventDetails: {
            answerId: 2409,
            text: 'Give details about the event'
          },
          somethingElseDetails: {
            answerId: 2410,
            text: 'Give details about what happened'
          }
        }
      },
      SMELL_EFFECT_ON_HEALTH: {
        questionId: 2500,
        key: constants.redisKeys.SMELL_EFFECT_ON_HEALTH,
        text: 'Did the smell cause any of these health problems?',
        answers: {
          headache: {
            answerId: 2501,
            text: 'Headache'
          },
          wateringEyes: {
            answerId: 2502,
            text: 'Watering eyes'
          },
          sicknessOrNausea: {
            answerId: 2503,
            text: 'Sickness or nausea'
          },
          vomiting: {
            answerId: 2504,
            text: 'Vomiting'
          },
          somethingElse: {
            answerId: 2505,
            text: SOMETHING_ELSE
          },
          noneOfthese: {
            answerId: 2506,
            text: NONE_OF_THESE
          },
          somethingElseDetails: {
            answerId: 2507,
            text: 'Give details about the health problem'
          }
        }
      },
      SMELL_MEDICAL_HELP: {
        questionId: 3300,
        key: constants.redisKeys.SMELL_MEDICAL_HELP,
        text: 'Have you had to get any medical help because of the smell?',
        answers: {
          yes: {
            answerId: 3301,
            text: 'Yes'
          },
          no: {
            answerId: 3302,
            text: 'No'
          }
        }
      },
      SMELL_CONTACT: {
        questionId: 3400,
        key: constants.redisKeys.SMELL_CONTACT,
        text: 'Can we contact you for more information if needed?',
        answers: {
          yes: {
            answerId: 3401,
            text: 'Yes'
          },
          no: {
            answerId: 3402,
            text: 'No'
          }
        }
      },
      SMELL_IMAGES_OR_VIDEO: {
        questionId: 3500,
        key: constants.redisKeys.SMELL_IMAGES_OR_VIDEO,
        text: 'Do you want to send us any images or videos of the problem?',
        answers: {
          yes: {
            answerId: 3501,
            text: 'Yes'
          },
          no: {
            answerId: 3502,
            text: 'No'
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
