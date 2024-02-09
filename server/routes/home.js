import constants from '../utils/constants.js'
import bcrypt from 'bcrypt'
import config from '../utils/config.js'

const handlers = {
  get: async (request, h) => {
    request.cookieAuth.clear()
    return h.view(constants.views.HOME)
  },
  post: async (request, h) => {
    const { fullName, phone, accessCode } = request.payload
    const errorSummary = validatePayload(fullName, phone, accessCode)

    // Validation error so return view in Error state
    if (errorSummary.errorList.length > 0) {
      request.cookieAuth.clear()
      return h.view(constants.views.HOME, {
        errorSummary,
        ...request.payload
      })
    }

    // Find account by accessCode
    const account = config.accounts.find(item => bcrypt.compareSync(accessCode, item.password))
    if (account) {
      request.cookieAuth.set({
        ...account,
        fullName,
        phone
      })
      return h.redirect(constants.routes.WATER_POLUTION)
    } else {
      // Handle error for bad accessCode
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
  const { errorSummary } = JSON.parse(JSON.stringify(constants.errors))
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
