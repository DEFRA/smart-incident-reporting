import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const imageQuestion = questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO
const yesPhotosAnswerId = imageQuestion.answers.yesPhotos.answerId
const yesVideoAnswerId = imageQuestion.answers.yesVideo.answerId

const isEmailRequired = (request) => {
  const imagesOrVideoAnswer = request.yar.get(constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO)
  if (!Array.isArray(imagesOrVideoAnswer)) { return false }

  return imagesOrVideoAnswer.some(answer => [yesPhotosAnswerId, yesVideoAnswerId].includes(answer.answerId))
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_CONTACT_DETAILS, {
      ...getContext(request),
      emailRequired: isEmailRequired(request)
    })
  },
  post: async (request, h) => {
    const { fullName, phone, email } = request.payload
    const emailRequired = isEmailRequired(request)
    const errorSummary = validatePayload(phone, email, emailRequired)

    // Validation error so return view in Error state
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_CONTACT_DETAILS, {
        errorSummary,
        emailRequired,
        ...request.payload
      })
    }

    request.yar.set(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS, {
      reporterName: fullName,
      reporterPhoneNumber: phone,
      reporterEmailAddress: email
    })

    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_OTHER_INFORMATION)
  }
}

const getContext = request => {
  const contactDetails = request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
  const fullName = contactDetails?.reporterName || ''
  const phone = contactDetails?.reporterPhoneNumber || ''
  const email = contactDetails?.reporterEmailAddress || ''

  return {
    fullName,
    phone,
    email
  }
}

const validatePayload = (phone, email, emailRequired) => {
  const errorSummary = getErrorSummary()
  if ((phone?.length > 0) && !constants.phoneRegex.test(phone)) {
    errorSummary.errorList.push({
      text: 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192',
      href: '#phone'
    })
  }

  if (emailRequired && !email?.length) {
    errorSummary.errorList.push({
      text: 'Enter your email address',
      href: '#email'
    })
  } else if ((email?.length > 0) && !validateEmail(email)) {
    errorSummary.errorList.push({
      text: 'Enter an email address in the correct format, like name@example.com',
      href: '#email'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_CONTACT_DETAILS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_CONTACT_DETAILS,
    handler: handlers.post
  }
]
