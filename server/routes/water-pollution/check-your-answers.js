import constants from '../../utils/constants.js'

const url = constants.routes

const handlers = {
  get: async (_request, h) => {
    //const answers = getAnswers()
    //console.log("data for answers", answers)
    return h.view(constants.views.WATER_POLLUTION_CHECK_YOUR_ANSWERS, {
      ...getContext()
    })
  }
}

const getContext = () => {
  return {
    url
  }
}

/* const getAnswers = () => {
  const { reporterName } = request.yar.get(constants.redisKeys.HOME)
  const { reporterPhoneNumber } = request.yar.get(constants.redisKeys.HOME)
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.HOME)

  return {
    reporterName: reporterName,
    reporterPhoneNumber: reporterPhoneNumber,
    reporterEmailAddress: reporterEmailAddress

  }
} */

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  }
]
