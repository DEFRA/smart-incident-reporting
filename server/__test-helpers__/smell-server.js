import { submitGetRequest as _submitGetRequest, submitPostRequest as _submitPostRequest } from './server.js'
import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'
import { session as mockSession } from '../__mock-data__/session-smell.js'

const { redisKeys: k } = constants

// Base session satisfies all guard prerequisites for any smell route
const baseSmellSession = {
  ...mockSession,
  [k.QUESTION_SET_ID]: questionSets.SMELL.questionSetId,
  [k.SMELL_LOCATION_OPTION]: [{ questionId: 2600, questionAsked: 'How do you want to tell us where you\'ve noticed the smell?', questionResponse: true, answerId: 2602 }],
  [k.SMELL_DESCRIPTION]: [{ questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1701 }],
  [k.SMELL_DATE_BEFORE_YESTERDAY]: { dateString: '2026-06-01', dateWordString: '1 June 2026', payload: { day: '1', month: '6', year: '2026' } },
  [k.SMELL_CONFIRM_ADDRESS]: { selectedAddress: '1 TEST STREET, LONDON, SW1A 1AA' },
  [k.SMELL_CHOOSE_ADDRESS]: { postcode: 'SW1A 1AA' }
}

const smellSession = (sessionData = {}) => ({ ...baseSmellSession, ...sessionData })

const submitGetRequest = (options, header, expectedResponseCode, sessionData) =>
  _submitGetRequest(options, header, expectedResponseCode, smellSession(sessionData))

const submitPostRequest = (options, expectedResponseCode, sessionData) =>
  _submitPostRequest(options, expectedResponseCode, smellSession(sessionData))

export { submitGetRequest, submitPostRequest }
