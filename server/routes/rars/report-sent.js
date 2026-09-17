import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const mediaUploadBaseUrl = '/media/upload-photo'
const imagesQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_IMAGES_OR_VIDEO

const createReportSentRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const submissionTimestamp = request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
      const sessionId = request.yar.id

      const contactDetails = request.yar.get(constants.redisKeys.RARS_CONTACT_DETAILS)
      const imagesOrVideoAnswer = request.yar.get(constants.redisKeys.RARS_IMAGES_OR_VIDEO)

      const reportersEmail = contactDetails?.reporterEmailAddress || ''
      const hasPhoneNumber = !!(contactDetails?.reporterPhoneNumber)
      const selectedAnswerIds = imagesOrVideoAnswer?.map(item => item.answerId) || []
      const userAgreedForVideos = selectedAnswerIds.includes(imagesQuestion.answers.yesVideo.answerId)
      const userAgreedForImages = selectedAnswerIds.includes(imagesQuestion.answers.yesPhotos.answerId)

      let mediaUploadLink

      if (userAgreedForImages) {
        await request.server.app.mediaUploadCache.set(sessionId, {
          journey: problem,
          dateTime: submissionTimestamp
        }, 168 * 60 * 60 * 1000)

        mediaUploadLink = `${mediaUploadBaseUrl}?sirid=${sessionId}`
      }

      request.yar.reset()
      const context = _getContext({
        reportersEmail,
        hasPhoneNumber,
        userAgreedForVideos,
        userAgreedForImages,
        mediaUploadLink
      })

      return h.view(constants.views.REPORT_SENT,
        {
          problem,
          ...context,
          ...serviceDetails
        }
      )
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

<<<<<<< HEAD
=======
const _getContext = (photoUploadDetails) => {
  return {
    hideBackLink: true,
    photoUploadDetails
  }
}

>>>>>>> report-a-regulated-site
export default createReportSentRoutes
