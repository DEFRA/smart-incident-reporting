import constants from '../../utils/constants.js'

const url = constants.routes

const handlers = {
  get: async (_request, h) => {
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

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  }
]
