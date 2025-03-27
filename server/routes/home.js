import constants from '../utils/constants.js'
import config from '../utils/config.js'
import { getErrorSummary, validateEmail } from '../utils/helpers.js'
import isWorkingHours from '../utils/is-working-hours.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.cookieAuth.clear()
    if (await isWorkingHours()) {
      return h.view(constants.views.HOME)
    } else {
      // request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  },
  post: async (request, h) => {
    const { fullName, phone, accessCode, email } = request.payload
    const errorSummary = validatePayload(fullName, phone, email, accessCode)

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
    console.log('Data for account', account)
    if (account) {
      request.cookieAuth.set({
        ...account,
        fullName,
        phone,
        email
      })
      request.yar.set(constants.redisKeys.HOME, {
        reporterName: fullName,
        reporterPhoneNumber: phone,
        reporterEmailAddress: email,
        reporterAccessCode: accessCode
      })

      if (accessCode.substring(0, 2).toUpperCase() === 'OD' || accessCode.substring(0, 4).toUpperCase() === 'RPSM') {
        request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.SMELL.questionSetId)
        return h.redirect(constants.routes.SMELL)
      } else {
        request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.WATER_POLLUTION.questionSetId)
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
            text: 'Check you have entered your access code correctly, without any spaces at the end',
            href: '#accessCode'
          }]
        }
      }).code(constants.statusCodes.UNAUTHORIZED)
    }
  }
}

const validatePayload = (fullName, phone, email, accessCode) => {
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
      text: 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192',
      href: '#phone'
    })
  } else {
    // do nothing; sonarcloud has lost the plot.
  }
  if (!validateEmail(email)) {
    errorSummary.errorList.push({
      text: 'Enter an email address in the correct format, like name@example.com',
      href: '#email'
    })
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
