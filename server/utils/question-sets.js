import constants from './constants.js'

// Common phrases
const YOU_DO_NOT_KNOW = 'You do not know'
const SOMETHING_ELSE = 'Something else'
const NONE_OF_THESE = 'None of these'
const YOU_DO_NOT_KNOW_SHORT = 'Don\'t know'
const NOT_GIVEN = 'Not given'
const USE_CURRENT_LOCATION = 'Use your current location'
const MARK_LOCATION_ON_MAP = 'Mark the location on an online map'
const DESCRIBE_THE_LOCATION = 'Describe the location'
const MARK_THE_LOCATION = 'Mark the location'
const RUBBISH_OR_REFUSE = 'Rubbish or refuse'
const IMAGES_OR_VIDEO_QUESTION = 'Do you have any photos or videos to include?'
const YES_YOU_HAVE_PHOTOS = 'Yes, you have photos'
const NO_YOU_DO_NOT_HAVE_PHOTOS = 'No, you do not have photos'
const YES_YOU_HAVE_VIDEO = 'Yes, you have video'
const NO_YOU_DO_NOT_HAVE_VIDEO = 'No, you do not have video'

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
            text: 'A pond, lake or reservoir',
            shortText: 'Pond, lake or reservoir'
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
          streamOrWatercourse: {
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
          },
          riverDetails: {
            answerId: 509
          },
          lakeOrReservoirDetails: {
            answerId: 510
          },
          canalDetails: {
            answerId: 511
          },
          streamOrWatercourseDetails: {
            answerId: 512
          }
        }
      },
      WATER_POLLUTION_LESS_THAN_10_METRES: {
        questionId: 700,
        key: constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES,
        text: 'How much pollution have you seen?',
        answers: {
          more: {
            answerId: 704,
            text: 'More than 10 metres',
            shortText: 'More than 10 metres'
          },
          less: {
            answerId: 705,
            text: 'Less than 10 metres',
            shortText: 'Less than 10 metres'
          }
        }
      },
      WATER_POLLUTION_LESS_THAN_100_SQ_METRES: {
        questionId: 800,
        key: constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
        text: 'How much pollution have you seen?',
        answers: {
          more: {
            answerId: 804,
            text: 'More than 100 square metres',
            shortText: 'More than 100 square metres'
          },
          less: {
            answerId: 805,
            text: 'Less than 100 square metres',
            shortText: 'Less than 100 square metres'
          }
        }
      },
      WATER_POLLUTION_POLLUTION_LENGTH: {
        questionId: 400,
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH,
        text: 'How far along the water feature have you seen the pollution?',
        answers: {
          stretches10to100m: {
            answerId: 401,
            text: '10 to 100 metres',
            shortText: '10 to 100 metres'
          },
          stretches100to500m: {
            answerId: 402,
            text: '100 to 500 metres',
            shortText: '100 to 500 metres'
          },
          stretches500to1000m: {
            answerId: 403,
            text: '500 metres to a kilometre',
            shortText: '500 metres to a kilometre'
          },
          over1km: {
            answerId: 404,
            text: 'More than a kilometre',
            shortText: 'More than a kilometre'
          }
        }
      },
      WATER_POLLUTION_POLLUTION_AREA: {
        questionId: 300,
        key: constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA,
        text: 'Over how wide an area have you seen the pollution?',
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
            text: 'Give details about what the pollution looks like '
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
        text: IMAGES_OR_VIDEO_QUESTION,
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
          },
          yesPhotos: {
            answerId: 2803,
            text: YES_YOU_HAVE_PHOTOS,
            shortText: 'Yes - photos'
          },
          noPhotos: {
            answerId: 2804,
            text: NO_YOU_DO_NOT_HAVE_PHOTOS,
            shortText: 'No - photos'
          },
          yesVideo: {
            answerId: 2805,
            text: YES_YOU_HAVE_VIDEO,
            shortText: 'Yes - video'
          },
          noVideo: {
            answerId: 2806,
            text: NO_YOU_DO_NOT_HAVE_VIDEO,
            shortText: 'No - video'
          }
        }
      },
      WATER_POLLUTION_LOCATION_OPTION: {
        questionId: 2600,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_OPTION,
        text: 'How do you want to tell us where you\'ve seen water pollution?',
        answers: {
          gps: {
            answerId: 2603,
            text: USE_CURRENT_LOCATION
          },
          map: {
            answerId: 2602,
            text: MARK_LOCATION_ON_MAP
          },
          description: {
            answerId: 2601,
            text: DESCRIBE_THE_LOCATION
          }
        }
      },
      WATER_POLLUTION_LOCATION_DESCRIPTION: {
        questionId: 900,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION,
        text: 'Location description',
        answers: {
          locationDetails: {
            answerId: 901
          }
        }
      },
      WATER_POLLUTION_LOCATION_MAP: {
        questionId: 2700,
        key: constants.redisKeys.WATER_POLLUTION_LOCATION_MAP,
        text: MARK_THE_LOCATION,
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          },
          lng: {
            answerId: 2704
          },
          lat: {
            answerId: 2705
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
            text: RUBBISH_OR_REFUSE,
            shortText: RUBBISH_OR_REFUSE
          },
          somethingElse: {
            answerId: 2905,
            text: SOMETHING_ELSE,
            shortText: SOMETHING_ELSE
          },
          unknown: {
            answerId: 2906,
            text: YOU_DO_NOT_KNOW,
            shortText: NOT_GIVEN
          },
          somethingElseDetail: {
            answerId: 2907,
            text: 'Give details about what you think the pollution is'
          }
        }
      },
      WATER_POLLUTION_SMELL_DESCRIPTION: {
        questionId: 1025,
        key: constants.redisKeys.WATER_POLLUTION_SMELL_DESCRIPTION,
        text: 'Is there a smell?',
        answers: {
          yes: {
            answerId: 1026,
            text: 'Yes',
            shortText: 'Yes'
          },
          no: {
            answerId: 1027,
            text: 'No',
            shortText: 'No'
          },
          yesDetails: {
            answerId: 1028,
            text: 'Describe the smell'
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
            text: 'Something else or you do not know'
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
        text: 'Enter your address',
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
        questionId: 2600,
        key: constants.redisKeys.SMELL_LOCATION_OPTION,
        text: 'How do you want to tell us where you\'ve noticed the smell?',
        answers: {
          gps: {
            answerId: 2603,
            text: USE_CURRENT_LOCATION
          },
          map: {
            answerId: 2602,
            text: MARK_LOCATION_ON_MAP
          },
          description: {
            answerId: 2601,
            text: DESCRIBE_THE_LOCATION
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
        text: MARK_THE_LOCATION,
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          },
          lng: {
            answerId: 2704
          },
          lat: {
            answerId: 2705
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
          veryWeak: {
            answerId: 2211,
            text: 'Very weak'
          },
          weak: {
            answerId: 2212,
            text: 'Weak'
          },
          distinct: {
            answerId: 2213,
            text: 'Distinct'
          },
          strong: {
            answerId: 2214,
            text: 'Strong'
          },
          veryStrong: {
            answerId: 2215,
            text: 'Very strong'
          },
          extremelyStrong: {
            answerId: 2216,
            text: 'Extremely strong'
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
        text: 'Did the smell cause any of these health problems, on this occasion?',
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
            text: 'Something else or you\'d prefer not to say'
          },
          noneOfthese: {
            answerId: 2506,
            text: NONE_OF_THESE
          },
          somethingElseDetails: {
            answerId: 2507,
            text: 'Give details about the health problem'
          },
          mentalHealthIssues: {
            answerId: 2508,
            text: 'Mental health issues, for example stress'
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
      SMELL_IMAGES_OR_VIDEO: {
        questionId: 3500,
        key: constants.redisKeys.SMELL_IMAGES_OR_VIDEO,
        text: IMAGES_OR_VIDEO_QUESTION,
        answers: {
          yes: {
            answerId: 3501,
            text: 'Yes'
          },
          no: {
            answerId: 3502,
            text: 'No'
          },
          yesPhotos: {
            answerId: 3503,
            text: YES_YOU_HAVE_PHOTOS
          },
          noPhotos: {
            answerId: 3504,
            text: NO_YOU_DO_NOT_HAVE_PHOTOS
          },
          yesVideo: {
            answerId: 3505,
            text: YES_YOU_HAVE_VIDEO
          },
          noVideo: {
            answerId: 3506,
            text: NO_YOU_DO_NOT_HAVE_VIDEO
          }
        }
      },
      SMELL_DESCRIPTION: {
        questionId: 1700,
        key: constants.redisKeys.SMELL_DESCRIPTION,
        text: 'How would you describe the smell?',
        answers: {
          sewage: {
            answerId: 1701,
            text: 'Sewage'
          },
          rubbishOrRefuse: {
            answerId: 1702,
            text: RUBBISH_OR_REFUSE
          },
          burningOrSmoke: {
            answerId: 1703,
            text: 'Burning or smoke'
          },
          gasOrPetrol: {
            answerId: 1704,
            text: 'Gas or petrol'
          },
          agriculture: {
            answerId: 1705,
            text: 'Agriculture'
          },
          somethingElse: {
            answerId: 1706,
            text: SOMETHING_ELSE
          },
          cannotDescribe: {
            answerId: 1707,
            text: 'You cannot describe it'
          },
          somethingElseDetails: {
            answerId: 1708
          }
        }
      }
    }
  },
  ILLEGAL_FISHING: {
    questionSetId: 1800,
    questions: {
      ILLEGAL_FISHING_WATER_FEATURE: {
        questionId: 500,
        key: constants.redisKeys.ILLEGAL_FISHING_WATER_FEATURE,
        text: 'In what kind of water have you seen illegal fishing?',
        answers: {
          river: {
            answerId: 501,
            text: 'A river'
          },
          lakeOrReservoir: {
            answerId: 502,
            text: 'A pond, lake or reservoir'
          },
          sea: {
            answerId: 503,
            text: 'The sea'
          },
          canal: {
            answerId: 504,
            text: 'A canal'
          },
          streamOrWatercourse: {
            answerId: 505,
            text: 'A smaller stream or watercourse'
          },
          somethingElse: {
            answerId: 506,
            text: SOMETHING_ELSE
          },
          youDoNotKnow: {
            answerId: 507,
            text: YOU_DO_NOT_KNOW
          },
          somethingElseDetails: {
            answerId: 508
          },
          riverDetails: {
            answerId: 509
          },
          lakeOrReservoirDetails: {
            answerId: 510
          },
          canalDetails: {
            answerId: 511
          },
          streamOrWatercourseDetails: {
            answerId: 512
          }
        }
      },
      ILLEGAL_FISHING_ACTIVITY: {
        questionId: 4200,
        key: constants.redisKeys.ILLEGAL_FISHING_ACTIVITY,
        text: 'What illegal fishing activity do you want to report?',
        answers: {
          withoutPermission: {
            answerId: 4201,
            text: 'Fishing without permission of the owner or club'
          },
          withoutRodLicense: {
            answerId: 4202,
            text: 'Fishing without a rod licence'
          },
          outOfSeason: {
            answerId: 4203,
            text: 'Fishing out of season'
          },
          illegalFishingEquipment: {
            answerId: 4204,
            text: 'Use of illegal fishing equipment'
          },
          protectedSpecies: {
            answerId: 4205,
            text: 'Fishing for protected species (including seasonal)'
          },
          somethingElse: {
            answerId: 4206,
            text: SOMETHING_ELSE
          },
          somethingElseDetails: {
            answerId: 4207,
            text: 'Give details of the activity'
          }
        }
      },
      ILLEGAL_FISHING_ROD_LICENCE: {
        questionId: 4210,
        key: constants.redisKeys.ILLEGAL_FISHING_ROD_LICENCE,
        text: 'How do you know the people fishing do not have a rod licence?',
        answers: {
          noRodLicenceDetails: {
            answerId: 4211
          }
        }
      },
      ILLEGAL_FISHING_LOCATION_OPTION: {
        questionId: 2600,
        key: constants.redisKeys.ILLEGAL_FISHING_LOCATION_OPTION,
        text: 'How do you want to tell us where you\'ve seen illegal fishing?',
        answers: {
          gps: {
            answerId: 2603,
            text: USE_CURRENT_LOCATION
          },
          map: {
            answerId: 2602,
            text: MARK_LOCATION_ON_MAP
          },
          description: {
            answerId: 2601,
            text: DESCRIBE_THE_LOCATION
          }
        }
      },
      ILLEGAL_FISHING_LOCATION_DESCRIPTION: {
        questionId: 900,
        key: constants.redisKeys.ILLEGAL_FISHING_LOCATION_DESCRIPTION,
        text: 'Describe the location where you\'ve seen illegal fishing',
        answers: {
          locationDetails: {
            answerId: 901
          }
        }
      },
      ILLEGAL_FISHING_LOCATION_MAP: {
        questionId: 2700,
        key: constants.redisKeys.ILLEGAL_FISHING_LOCATION_MAP,
        text: MARK_THE_LOCATION,
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          },
          lng: {
            answerId: 2704
          },
          lat: {
            answerId: 2705
          }
        }
      },
      ILLEGAL_FISHING_PEOPLE_FISHING: {
        questionId: 4270,
        key: constants.redisKeys.ILLEGAL_FISHING_PEOPLE_FISHING,
        text: 'Are people fishing here now?',
        answers: {
          yes: {
            answerId: 4271,
            text: 'Yes'
          },
          no: {
            answerId: 4272,
            text: 'No'
          },
          youDoNotKnow: {
            answerId: 4273,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      ILLEGAL_FISHING_NUMBER_OF_PEOPLE: {
        questionId: 4275,
        key: constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_PEOPLE,
        text: 'How many people are there?',
        answers: {
          one: {
            answerId: 4276,
            text: 'One'
          },
          two: {
            answerId: 4277,
            text: 'Two'
          },
          threeOrMore: {
            answerId: 4278,
            text: 'Three or more'
          }
        }
      },
      ILLEGAL_FISHING_PEOPLE_DESCRIPTION: {
        questionId: 4250,
        key: constants.redisKeys.ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
        text: 'Can you describe anyone involved?',
        answers: {
          yes: {
            answerId: 4251,
            text: 'Yes'
          },
          no: {
            answerId: 4252,
            text: 'No'
          },
          doNotPrefer: {
            answerId: 4253,
            text: 'You would prefer not to'
          }
        }
      },
      ILLEGAL_FISHING_DESCRIPTION_DETAILS: {
        questionId: 4260,
        key: constants.redisKeys.ILLEGAL_FISHING_DESCRIPTION_DETAILS,
        text: 'Describe the people involved',
        answers: {
          descriptionDetails: {
            answerId: 4261
          },
          vehicleRegistration: {
            answerId: 4262,
            text: 'Vehicle registration (if known)'
          }
        }
      },
      ILLEGAL_FISHING_VEHICLE_REGISTERATION_DETAILS: {
        questionId: 4265,
        key: constants.redisKeys.ILLEGAL_FISHING_VEHICLE_REGISTERATION_DETAILS,
        text: 'Vehicle registration (if known)',
        answers: {
          vehicleRegistration: {
            answerId: 4266
          }
        }
      },
      ILLEGAL_FISHING_ILLEGAL_EQUIPMENT: {
        questionId: 4240,
        key: constants.redisKeys.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT,
        text: 'What illegal equipment is being used?',
        answers: {
          netsOrTraps: {
            answerId: 4241,
            text: 'Nets or traps'
          },
          fixedLines: {
            answerId: 4242,
            text: 'Fixed lines'
          },
          illegalRodOrTackle: {
            answerId: 4243,
            text: 'Illegal rod or tackle'
          },
          electricStunDevices: {
            answerId: 4244,
            text: 'Electric \'stun\' devices'
          },
          somethingElse: {
            answerId: 4245,
            text: SOMETHING_ELSE
          },
          unknown: {
            answerId: 4246,
            text: YOU_DO_NOT_KNOW
          },
          somethingElseDetail: {
            answerId: 4247,
            text: 'Give details of the equipment'
          }
        }
      },
      ILLEGAL_FISHING_TYPE_OF_FISH: {
        questionId: 4230,
        key: constants.redisKeys.ILLEGAL_FISHING_TYPE_OF_FISH,
        text: 'What type of fish are being caught or targeted?',
        answers: {
          salmon: {
            answerId: 4231,
            text: 'Salmon'
          },
          lampreyOrEel: {
            answerId: 4232,
            text: 'Lamprey or eel'
          },
          seaTrout: {
            answerId: 4233,
            text: 'Sea trout'
          },
          freshwaterFish: {
            answerId: 4234,
            text: 'Freshwater fish'
          },
          crayfish: {
            answerId: 4235,
            text: 'Crayfish'
          },
          otherFish: {
            answerId: 4236,
            text: 'Other fish'
          },
          unknown: {
            answerId: 4237,
            text: YOU_DO_NOT_KNOW
          },
          otherFishDetail: {
            answerId: 4238,
            text: 'Give details of the type of fish'
          }
        }
      },
      ILLEGAL_FISHING_FISH_TAKEN: {
        questionId: 4215,
        key: constants.redisKeys.ILLEGAL_FISHING_FISH_TAKEN,
        text: 'Did you see fish being \'taken\'?',
        answers: {
          yes: {
            answerId: 4216,
            text: 'Yes'
          },
          no: {
            answerId: 4217,
            text: 'No'
          }
        }
      },
      ILLEGAL_FISHING_NUMBER_OF_FISH: {
        questionId: 4220,
        key: constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_FISH,
        text: 'How many fish?',
        answers: {
          fiveOrMore: {
            answerId: 4221,
            text: '5 or more'
          },
          lessThanFive: {
            answerId: 4222,
            text: 'Less than 5'
          },
          youDoNotKnow: {
            answerId: 4223,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      ILLEGAL_FISHING_IMAGES_OR_VIDEO: {
        questionId: 2800,
        key: constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO,
        text: IMAGES_OR_VIDEO_QUESTION,
        answers: {
          yes: {
            answerId: 2801,
            text: 'Yes'
          },
          no: {
            answerId: 2802,
            text: 'No'
          },
          yesPhotos: {
            answerId: 2803,
            text: YES_YOU_HAVE_PHOTOS
          },
          noPhotos: {
            answerId: 2804,
            text: NO_YOU_DO_NOT_HAVE_PHOTOS
          },
          yesVideo: {
            answerId: 2805,
            text: YES_YOU_HAVE_VIDEO
          },
          noVideo: {
            answerId: 2806,
            text: NO_YOU_DO_NOT_HAVE_VIDEO
          }
        }
      },
      ILLEGAL_FISHING_ANGLING_TRUST: {
        questionId: 4280,
        key: constants.redisKeys.ILLEGAL_FISHING_ANGLING_TRUST,
        text: 'Are you an Angling Trust volunteer?',
        answers: {
          yes: {
            answerId: 4281,
            text: 'Yes'
          },
          no: {
            answerId: 4282,
            text: 'No'
          }
        }
      }
    }
  },
  BLOCKAGE: {
    questionSetId: 300,
    questions: {
      BLOCKAGE_RIVER_NAME: {
        questionId: 105,
        key: constants.redisKeys.BLOCKAGE_RIVER_NAME,
        text: 'Do you know the name of the river?',
        answers: {
          yes: {
            answerId: 106,
            text: 'Yes'
          },
          no: {
            answerId: 107,
            text: 'No'
          },
          yesDetails: {
            answerId: 108,
            text: 'Name of the river'
          }
        }
      },
      BLOCKAGE_TYPE: {
        questionId: 110,
        key: constants.redisKeys.BLOCKAGE_TYPE,
        text: 'What\'s blocking the river?',
        answers: {
          fallenTree: {
            answerId: 111,
            text: 'A fallen tree or other vegetation'
          },
          vehicle: {
            answerId: 112,
            text: 'A vehicle'
          },
          rubbish: {
            answerId: 113,
            text: 'A build-up of material, such as rubbish, soil or stone'
          },
          deliberate: {
            answerId: 114,
            text: 'Someone deliberately blocking the river, for example with a temporary structure'
          },
          somethingElse: {
            answerId: 115,
            text: SOMETHING_ELSE
          },
          youDoNotKnow: {
            answerId: 116,
            text: YOU_DO_NOT_KNOW
          },
          somethingElseDetails: {
            answerId: 117
          }
        }
      },
      BLOCKAGE_LOCATION_OPTION: {
        questionId: 2600,
        key: constants.redisKeys.BLOCKAGE_LOCATION_OPTION,
        text: 'How do you want to tell us where the blockage is?',
        answers: {
          gps: {
            answerId: 2603,
            text: USE_CURRENT_LOCATION
          },
          map: {
            answerId: 2602,
            text: MARK_LOCATION_ON_MAP
          },
          description: {
            answerId: 2601,
            text: DESCRIBE_THE_LOCATION
          }
        }
      },
      BLOCKAGE_LOCATION_MAP: {
        questionId: 2700,
        key: constants.redisKeys.BLOCKAGE_LOCATION_MAP,
        text: MARK_THE_LOCATION,
        answers: {
          nationalGridReference: {
            answerId: 2701
          },
          easting: {
            answerId: 2702
          },
          northing: {
            answerId: 2703
          },
          lng: {
            answerId: 2704
          },
          lat: {
            answerId: 2705
          }
        }
      },
      BLOCKAGE_LOCATION_DESCRIPTION: {
        questionId: 900,
        key: constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION,
        text: 'Location description',
        answers: {
          locationDetails: {
            answerId: 901
          }
        }
      },
      BLOCKAGE_HISTORY: {
        questionId: 120,
        key: constants.redisKeys.BLOCKAGE_HISTORY,
        text: 'Has the blockage been here for some time?',
        answers: {
          yes: {
            answerId: 121,
            text: 'Yes'
          },
          no: {
            answerId: 122,
            text: 'No'
          },
          youDoNotKnow: {
            answerId: 123,
            text: YOU_DO_NOT_KNOW
          },
          yesDetails: {
            answerId: 124,
            text: 'Give details about how long the blockage has been here'
          }
        }
      },
      BLOCKAGE_EXTENT: {
        questionId: 130,
        key: constants.redisKeys.BLOCKAGE_EXTENT,
        text: 'How much of the river is blocked?',
        answers: {
          full: {
            answerId: 131,
            text: 'The full width (from bank to bank)'
          },
          moreThanHalf: {
            answerId: 132,
            text: 'More than half the width'
          },
          lessThanHalf: {
            answerId: 133,
            text: 'Less than half the width'
          },
          youDoNotKnow: {
            answerId: 134,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      BLOCKAGE_WATER_LEVEL: {
        questionId: 140,
        key: constants.redisKeys.BLOCKAGE_WATER_LEVEL,
        text: 'Is water building up behind the blockage?',
        answers: {
          yes: {
            answerId: 141,
            text: 'Yes'
          },
          no: {
            answerId: 142,
            text: 'No'
          },
          youDoNotKnow: {
            answerId: 143,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      BLOCKAGE_FLOOD_RISK: {
        questionId: 150,
        key: constants.redisKeys.BLOCKAGE_FLOOD_RISK,
        text: 'Will the blockage cause a flood if it is not removed?',
        answers: {
          alreadyFlooding: {
            answerId: 151,
            text: "There's already flooding"
          },
          yes: {
            answerId: 152,
            text: 'Yes'
          },
          no: {
            answerId: 153,
            text: 'No'
          },
          youDoNotKnow: {
            answerId: 154,
            text: YOU_DO_NOT_KNOW
          }
        }
      },
      BLOCKAGE_OWNER: {
        questionId: 180,
        key: constants.redisKeys.BLOCKAGE_OWNER,
        text: 'Do you know who is responsible for causing the blockage?',
        answers: {
          yes: {
            answerId: 181,
            text: 'Yes'
          },
          no: {
            answerId: 182,
            text: 'No'
          },
          yesDetails: {
            answerId: 183,
            text: 'Yes details'
          }
        }
      },
      BLOCKAGE_FLOOD_RISK_DANGER: {
        questionId: 160,
        key: constants.redisKeys.BLOCKAGE_FLOOD_RISK_DANGER,
        text: 'What is at risk from flooding?',
        answers: {
          yourHome: {
            answerId: 161,
            text: 'Your home or parts of it, including your garage if attached'
          },
          yourOtherProperty: {
            answerId: 162,
            text: 'Other property you own, for example your garden, sheds or a detached garage'
          },
          otherPeopleHome: {
            answerId: 163,
            text: 'Other people\'s homes'
          },
          commercialProperty: {
            answerId: 164,
            text: 'Commercial or public buildings, for example shops or businesses'
          },
          road: {
            answerId: 165,
            text: 'Roads, railways, powerlines or similar'
          },
          farmland: {
            answerId: 166,
            text: 'Farmland or countryside'
          },
          animal: {
            answerId: 167,
            text: 'Animals, for example cattle or horses'
          },
          somethingElse: {
            answerId: 168,
            text: SOMETHING_ELSE
          },
          unknown: {
            answerId: 169,
            text: YOU_DO_NOT_KNOW
          },
          commercialPropertyDetail: {
            answerId: 170,
            text: 'Give details about type of building at risk from flooding'
          },
          somethingElseDetail: {
            answerId: 171,
            text: 'Give details about what is at risk from flooding'
          }
        }
      },
      BLOCKAGE_IMAGES_OR_VIDEO: {
        questionId: 2800,
        key: constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO,
        text: IMAGES_OR_VIDEO_QUESTION,
        answers: {
          yes: {
            answerId: 2801,
            text: 'Yes'
          },
          no: {
            answerId: 2802,
            text: 'No'
          },
          yesPhotos: {
            answerId: 2803,
            text: YES_YOU_HAVE_PHOTOS
          },
          noPhotos: {
            answerId: 2804,
            text: NO_YOU_DO_NOT_HAVE_PHOTOS
          },
          yesVideo: {
            answerId: 2805,
            text: YES_YOU_HAVE_VIDEO
          },
          noVideo: {
            answerId: 2806,
            text: NO_YOU_DO_NOT_HAVE_VIDEO
          }
        }
      }
    }
  },
  CREATE_A_REPORT: {
    questionSetId: 0,
    questions: {
      REPORTED_BY_EMAIL: {
        questionId: 3800,
        text: 'Reported by email?',
        answers: {
          yes: {
            answerId: 3801,
            text: 'Yes'
          },
          no: {
            answerId: 3802,
            text: 'No'
          }
        }
      },
      REPORTED_PHOTOS_OR_VIDEOS: {
        questionId: 3900,
        text: 'Photos or videos available',
        answers: {
          yes: {
            answerId: 3901,
            text: 'Yes'
          },
          no: {
            answerId: 3902,
            text: 'NO'
          },
          yesPhotos: {
            answerId: 3903,
            text: YES_YOU_HAVE_PHOTOS
          },
          noPhotos: {
            answerId: 3904,
            text: NO_YOU_DO_NOT_HAVE_PHOTOS
          },
          yesVideo: {
            answerId: 3905,
            text: YES_YOU_HAVE_VIDEO
          },
          noVideo: {
            answerId: 3906,
            text: NO_YOU_DO_NOT_HAVE_VIDEO
          }
        }
      },
      TYPE_OF_REPORTER: {
        questionId: 4000,
        text: 'Type of reporter',
        answers: {
          water: {
            answerId: 4001,
            text: 'Water company'
          },
          other: {
            answerId: 4002,
            text: 'Public organisation'
          },
          name: {
            answerId: 4003,
            text: 'Name of company or organisation'
          },
          public: {
            answerId: 4004,
            text: 'Member of public'
          },
          role: {
            answerId: 4005,
            text: 'Reporter role or job title (optional)'
          },
          anonymous: {
            answerId: 4006,
            text: 'Anonymous'
          }
        }
      },
      INCIDENT_LOCATION: {
        questionId: 4100,
        text: 'Location of incident',
        answers: {
          nationalGridReference: {
            answerId: 4101
          },
          locationDescription: {
            answerId: 4102
          }
        }
      }
    }
  },
  REPORT_REGULATED_SITE: {
    questionSetId: 200,
    questions: {
      VERMIN_TYPE: {
        questionId: 1620,
        key: constants.redisKeys.VERMIN_TYPE,
        text: 'What type of vermin or pest is causing a problem?',
        answers: {
          flies: {
            answerId: 1621,
            text: 'Flies'
          },
          rats: {
            answerId: 1622,
            text: 'Rats'
          },
          seagulls: {
            answerId: 1623,
            text: 'Seagulls'
          },
          somethingElse: {
            answerId: 1624,
            text: SOMETHING_ELSE,
            shortText: SOMETHING_ELSE
          },
          somethingElseDetail: {
            answerId: 1625,
            text: 'Type of vermin or pest'
          }
        }
      },
      RARS_SOURCE: {
        questionId: 1600,
        key: constants.redisKeys.RARS_SOURCE,
        text: 'Where is the {problem} coming from?',
        answers: {
          wasteSite: {
            answerId: 1601,
            text: 'A waste site, for example a landfill or recycling centre'
          },
          industry: {
            answerId: 1602,
            text: 'A large industrial site, factory or business, for example a food processing or chemical plant'
          },
          sewage: {
            answerId: 1603,
            text: 'A sewage or water treatment works'
          },
          farm: {
            answerId: 1609,
            text: 'A farm or farming activity'
          },
          local: {
            answerId: 1605,
            text: 'A small local business, for example a restaurant'
          },
          neighbour: {
            answerId: 1606,
            text: 'A neighbouring property'
          },
          unknown: {
            answerId: 1608,
            text: 'Something else or you do not know'
          }
        }
      }
    }
  }
}

export {
  questionSets
}
