import { submitGetRequest } from '../../__test-helpers__/server.js'
import { questionSets } from '../../utils/question-sets.js'
import constants from '../../utils/constants.js'
import { session as fullSession } from '../../__mock-data__/session-smell.js'

const { routes: r, redisKeys: k } = constants
const smellQuestionSetId = questionSets.SMELL.questionSetId

// Full session with question-set-id and branch-specific keys included
const completeSession = {
  ...fullSession,
  [k.QUESTION_SET_ID]: smellQuestionSetId,
  // Branch-specific keys not in default mock session
  [k.SMELL_LOCATION_OPTION]: [{ questionId: 2600, questionAsked: 'How do you want to tell us where you\'ve noticed the smell?', questionResponse: true, answerId: 2602 }],
  [k.SMELL_DESCRIPTION]: [{ questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1701 }],
  [k.SMELL_DATE_BEFORE_YESTERDAY]: { dateString: '2026-06-01', dateWordString: '1 June 2026', payload: { day: '1', month: '6', year: '2026' } },
  [k.SMELL_CONFIRM_ADDRESS]: { selectedAddress: '1 TEST STREET, LONDON, SW1A 1AA' },
  [k.SMELL_CHOOSE_ADDRESS]: { postcode: 'SW1A 1AA' }
}

// Every guarded route and where it should redirect when its prerequisite is missing
const guardedRoutes = [
  [r.SMELL_SOURCE_DETAILS, r.SMELL_SOURCE],
  [r.SMELL_REPORT_LOCAL_COUNCIL, r.SMELL_SOURCE],
  [r.SMELL_CONTACT_LOCAL_COUNCIL, r.SMELL_SOURCE],
  [r.SMELL_LOCATION_HOME, r.SMELL_SOURCE_DETAILS],
  [r.SMELL_FIND_ADDRESS, r.SMELL_LOCATION_HOME],
  [r.SMELL_CHOOSE_ADDRESS, r.SMELL_LOCATION_HOME],
  [r.SMELL_CONFIRM_ADDRESS, r.SMELL_LOCATION_HOME],
  [r.SMELL_EXCEEDED_ATTEMPTS, r.SMELL_LOCATION_HOME],
  [r.SMELL_LOCATION_ADDRESS, r.SMELL_LOCATION_HOME],
  [r.SMELL_LOCATION_OPTION, r.SMELL_LOCATION_HOME],
  [r.SMELL_DESCRIPTION, r.SMELL_LOCATION_HOME],
  [r.SMELL_LOCATION_MAP, r.SMELL_LOCATION_OPTION],
  [r.SMELL_LOCATION_DESCRIPTION, r.SMELL_LOCATION_OPTION],
  [r.SMELL_PREVIOUS, r.SMELL_DESCRIPTION],
  [r.SMELL_START_DATE_TIME, r.SMELL_PREVIOUS],
  [r.SMELL_EARLIER_TODAY, r.SMELL_PREVIOUS],
  [r.SMELL_YESTERDAY, r.SMELL_PREVIOUS],
  [r.SMELL_DATE_BEFORE_YESTERDAY, r.SMELL_PREVIOUS],
  [r.SMELL_TIME_BEFORE_YESTERDAY, r.SMELL_DATE_BEFORE_YESTERDAY],
  [r.SMELL_CURRENT, r.SMELL_START_DATE_TIME],
  [r.SMELL_SMELL_STRENGTH, r.SMELL_START_DATE_TIME],
  [r.SMELL_INDOORS, r.SMELL_SMELL_STRENGTH],
  [r.SMELL_CLOTHING_AND_HAIR, r.SMELL_INDOORS],
  [r.SMELL_EFFECT_ON_DAILY_LIFE, r.SMELL_CLOTHING_AND_HAIR],
  [r.SMELL_EFFECT_ON_HEALTH, r.SMELL_EFFECT_ON_DAILY_LIFE],
  [r.SMELL_MEDICAL_HELP, r.SMELL_EFFECT_ON_HEALTH],
  [r.SMELL_CONTACT_DETAILS, r.SMELL_EFFECT_ON_HEALTH],
  [r.SMELL_IMAGES_OR_VIDEO, r.SMELL_CONTACT_DETAILS],
  [r.SMELL_OTHER_INFORMATION, r.SMELL_IMAGES_OR_VIDEO]
]

// Routes that require specific API/address mock data for their GET handlers — tested for redirect only
const addressRoutes = [r.SMELL_CHOOSE_ADDRESS, r.SMELL_CONFIRM_ADDRESS]

// Routes suitable for the "allowed with full session" test
const allowedRoutes = guardedRoutes.filter(([route]) => !addressRoutes.includes(route))

// Map route → the session key it requires
const routeToRequiredKey = {
  [r.SMELL_SOURCE_DETAILS]: k.SMELL_SOURCE,
  [r.SMELL_REPORT_LOCAL_COUNCIL]: k.SMELL_SOURCE,
  [r.SMELL_CONTACT_LOCAL_COUNCIL]: k.SMELL_SOURCE,
  [r.SMELL_LOCATION_HOME]: k.SMELL_SOURCE_DETAILS,
  [r.SMELL_FIND_ADDRESS]: k.SMELL_LOCATION_HOME,
  [r.SMELL_CHOOSE_ADDRESS]: k.SMELL_LOCATION_HOME,
  [r.SMELL_CONFIRM_ADDRESS]: k.SMELL_LOCATION_HOME,
  [r.SMELL_EXCEEDED_ATTEMPTS]: k.SMELL_LOCATION_HOME,
  [r.SMELL_LOCATION_ADDRESS]: k.SMELL_LOCATION_HOME,
  [r.SMELL_LOCATION_OPTION]: k.SMELL_LOCATION_HOME,
  [r.SMELL_DESCRIPTION]: k.SMELL_LOCATION_HOME,
  [r.SMELL_LOCATION_MAP]: k.SMELL_LOCATION_OPTION,
  [r.SMELL_LOCATION_DESCRIPTION]: k.SMELL_LOCATION_OPTION,
  [r.SMELL_PREVIOUS]: k.SMELL_DESCRIPTION,
  [r.SMELL_START_DATE_TIME]: k.SMELL_PREVIOUS,
  [r.SMELL_EARLIER_TODAY]: k.SMELL_PREVIOUS,
  [r.SMELL_YESTERDAY]: k.SMELL_PREVIOUS,
  [r.SMELL_DATE_BEFORE_YESTERDAY]: k.SMELL_PREVIOUS,
  [r.SMELL_TIME_BEFORE_YESTERDAY]: k.SMELL_DATE_BEFORE_YESTERDAY,
  [r.SMELL_CURRENT]: k.SMELL_START_DATE_TIME,
  [r.SMELL_SMELL_STRENGTH]: k.SMELL_START_DATE_TIME,
  [r.SMELL_INDOORS]: k.SMELL_SMELL_STRENGTH,
  [r.SMELL_CLOTHING_AND_HAIR]: k.SMELL_INDOORS,
  [r.SMELL_EFFECT_ON_DAILY_LIFE]: k.SMELL_CLOTHING_AND_HAIR,
  [r.SMELL_EFFECT_ON_HEALTH]: k.SMELL_EFFECT_ON_DAILY_LIFE,
  [r.SMELL_MEDICAL_HELP]: k.SMELL_EFFECT_ON_HEALTH,
  [r.SMELL_CONTACT_DETAILS]: k.SMELL_EFFECT_ON_HEALTH,
  [r.SMELL_IMAGES_OR_VIDEO]: k.SMELL_CONTACT_DETAILS,
  [r.SMELL_OTHER_INFORMATION]: k.SMELL_IMAGES_OR_VIDEO
}

describe('Smell journey guard (onPreHandler)', () => {
  describe('Should allow access when prerequisites are met', () => {
    it.each(allowedRoutes)('%s → allowed with full session', async (route) => {
      const response = await submitGetRequest(
        { url: route },
        null,
        constants.statusCodes.OK,
        completeSession
      )
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('Should redirect when prerequisite is missing', () => {
    it.each(guardedRoutes)('%s → redirects to %s when prerequisite missing', async (route, expectedRedirect) => {
      // Session with question-set-id but missing the required key for this route
      const requiredKey = routeToRequiredKey[route]
      const sessionWithout = { ...completeSession }
      delete sessionWithout[requiredKey]

      const response = await submitGetRequest(
        { url: route },
        null,
        constants.statusCodes.REDIRECT,
        sessionWithout
      )
      expect(response.headers.location).toEqual(expectedRedirect)
    })
  })

  describe('Should redirect to smell when no active smell journey', () => {
    it.each(guardedRoutes)('%s → redirects to smell with no question-set-id', async (route) => {
      const response = await submitGetRequest(
        { url: route },
        null,
        constants.statusCodes.REDIRECT,
        {}
      )
      expect(response.headers.location).toEqual(r.SMELL)
    })
  })
})
