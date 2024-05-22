import constants from '../utils/constants.js'
import config from '../utils/config.js'
import { getErrorSummary } from '../utils/helpers.js'
import isWorkingHours from '../utils/is-working-hours.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.cookieAuth.clear()
    if (await isWorkingHours()) {
      return h.view(constants.views.HOME)
    } else {
      request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  },
  post: async (request, h) => {
    const { fullName, phone, accessCode } = request.payload
    const errorSummary = validatePayload(fullName, phone, accessCode)

    // Validation error so return view in Error state
    if (errorSummary.errorList.length > 0) {
      request.yar.reset()
      request.cookieAuth.clear()
      return h.view(constants.views.HOME, {
        errorSummary,
        ...request.payload
      })
    }

    // Find account by accessCode
    const account = config.accounts.find(item => item.password === accessCode)
    if (account) {
      request.cookieAuth.set({
        ...account,
        fullName,
        phone
      })
      request.yar.set(constants.redisKeys.HOME, {
        reporterName: fullName,
        reporterPhoneNumber: phone,
        reporterAccessCode: accessCode
      })

      if (accessCode.substring(0, 2).toUpperCase() === 'OD') {
        return h.redirect(constants.routes.SMELL)
      } else {
        return h.redirect(constants.routes.WATER_POLUTION)
      }
    } else {
      // Handle error for bad accessCode
      request.yar.reset()
      request.cookieAuth.clear()
      return h.view(constants.views.HOME, {
        ...request.payload,
        errorSummary: {
          titleText: 'There is a problem',
          errorList: [{
            text: 'Check you have entered your access code correctly',
            href: '#accessCode'
          }]
        }
      }).code(constants.statusCodes.UNAUTHORIZED)
    }
  }
}

const validatePayload = (fullName, phone, accessCode) => {
  const errorSummary = getErrorSummary()
  if (!fullName) {
    errorSummary.errorList.push({
      text: 'Enter your name',
      href: '#fullName'
    })
  }
  if (!phone) {
    errorSummary.errorList.push({
      text: 'Enter a phone number',
      href: '#phone'
    })
  } else if (!constants.phoneRegex.test(phone)) {
    errorSummary.errorList.push({
      text: 'Enter a real phone number',
      href: '#phone'
    })
  } else {
    // do nothing; sonarcloud has lost the plot.
  }
  if (!accessCode) {
    errorSummary.errorList.push({
      text: 'Enter an access code',
      href: '#accessCode'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/',
    handler: handlers.post,
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
]
