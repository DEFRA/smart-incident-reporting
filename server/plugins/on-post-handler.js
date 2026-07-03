import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const { routes: r, redisKeys: k } = constants

// Route → session key that must exist before the route can be accessed
const smellPrerequisites = Object.fromEntries([
  [k.SMELL_SOURCE, [r.SMELL_SOURCE_DETAILS, r.SMELL_REPORT_LOCAL_COUNCIL, r.SMELL_CONTACT_LOCAL_COUNCIL]],
  [k.SMELL_SOURCE_DETAILS, [r.SMELL_LOCATION_HOME]],
  [k.SMELL_LOCATION_HOME, [r.SMELL_FIND_ADDRESS, r.SMELL_CHOOSE_ADDRESS, r.SMELL_CONFIRM_ADDRESS, r.SMELL_EXCEEDED_ATTEMPTS, r.SMELL_LOCATION_ADDRESS, r.SMELL_LOCATION_OPTION, r.SMELL_DESCRIPTION]],
  [k.SMELL_LOCATION_OPTION, [r.SMELL_LOCATION_MAP, r.SMELL_LOCATION_DESCRIPTION]],
  [k.SMELL_DESCRIPTION, [r.SMELL_PREVIOUS]],
  [k.SMELL_PREVIOUS, [r.SMELL_START_DATE_TIME, r.SMELL_EARLIER_TODAY, r.SMELL_YESTERDAY, r.SMELL_DATE_BEFORE_YESTERDAY]],
  [k.SMELL_DATE_BEFORE_YESTERDAY, [r.SMELL_TIME_BEFORE_YESTERDAY]],
  [k.SMELL_START_DATE_TIME, [r.SMELL_CURRENT, r.SMELL_SMELL_STRENGTH]],
  [k.SMELL_SMELL_STRENGTH, [r.SMELL_INDOORS]],
  [k.SMELL_INDOORS, [r.SMELL_CLOTHING_AND_HAIR]],
  [k.SMELL_CLOTHING_AND_HAIR, [r.SMELL_EFFECT_ON_DAILY_LIFE]],
  [k.SMELL_EFFECT_ON_DAILY_LIFE, [r.SMELL_EFFECT_ON_HEALTH]],
  [k.SMELL_EFFECT_ON_HEALTH, [r.SMELL_MEDICAL_HELP, r.SMELL_CONTACT_DETAILS]],
  [k.SMELL_CONTACT_DETAILS, [r.SMELL_IMAGES_OR_VIDEO]],
  [k.SMELL_IMAGES_OR_VIDEO, [r.SMELL_OTHER_INFORMATION]]
].flatMap(([key, routes]) => routes.map(route => [route, key])))

// Session key → the route the user needs to visit to set that key
const smellKeyToRoute = {
  [k.SMELL_SOURCE]: r.SMELL_SOURCE,
  [k.SMELL_SOURCE_DETAILS]: r.SMELL_SOURCE_DETAILS,
  [k.SMELL_LOCATION_HOME]: r.SMELL_LOCATION_HOME,
  [k.SMELL_LOCATION_OPTION]: r.SMELL_LOCATION_OPTION,
  [k.SMELL_DESCRIPTION]: r.SMELL_DESCRIPTION,
  [k.SMELL_PREVIOUS]: r.SMELL_PREVIOUS,
  [k.SMELL_DATE_BEFORE_YESTERDAY]: r.SMELL_DATE_BEFORE_YESTERDAY,
  [k.SMELL_START_DATE_TIME]: r.SMELL_START_DATE_TIME,
  [k.SMELL_SMELL_STRENGTH]: r.SMELL_SMELL_STRENGTH,
  [k.SMELL_INDOORS]: r.SMELL_INDOORS,
  [k.SMELL_CLOTHING_AND_HAIR]: r.SMELL_CLOTHING_AND_HAIR,
  [k.SMELL_EFFECT_ON_DAILY_LIFE]: r.SMELL_EFFECT_ON_DAILY_LIFE,
  [k.SMELL_EFFECT_ON_HEALTH]: r.SMELL_EFFECT_ON_HEALTH,
  [k.SMELL_CONTACT_DETAILS]: r.SMELL_CONTACT_DETAILS,
  [k.SMELL_IMAGES_OR_VIDEO]: r.SMELL_IMAGES_OR_VIDEO
}

const getSmellJourneyRedirect = (request) => {
  const { path } = request

  if (!path.startsWith('/smell/')) {
    return null
  }
  if (request.yar.get(k.QUESTION_SET_ID) !== questionSets.SMELL.questionSetId) {
    return r.SMELL_START
  }

  const requiredKey = smellPrerequisites[path]
  if (!requiredKey) {
    return null
  }

  const value = request.yar.get(requiredKey)
  return (!value || (Array.isArray(value) && !value.length)) ? smellKeyToRoute[requiredKey] : null
}

const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPreHandler', (request, h) => {
        const redirect = getSmellJourneyRedirect(request)
        return redirect ? h.redirect(redirect).takeover() : h.continue
      })

      server.ext('onPostHandler', async (request, h) => {
        if (request.response.variety === 'view' && request.method === 'get') {
          request.response.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
          handleReferer(request)
        }
        return h.continue
      })
    }
  }
}

const handleReferer = request => {
  if (request.headers.referer) {
    // If referer was a check route then set the session referer
    // Route then decides whether to redirect to referer or not
    const setReferer = constants.setReferer.find(item => request.headers.referer.indexOf(item) > -1)
    const clearReferer = constants.clearReferer.find(item => request.headers.referer.indexOf(item) > -1)
    if (setReferer) {
      request.yar.set(constants.redisKeys.REFERER, `/${setReferer}`)
    } else if (clearReferer) {
      request.yar.clear(constants.redisKeys.REFERER)
    } else {
      // do nothing for sonarcloud
    }
  } else {
    // If no referer then clear referer key because user has broken the journey
    request.yar.clear(constants.redisKeys.REFERER)
  }
}

export default onPostHandler
