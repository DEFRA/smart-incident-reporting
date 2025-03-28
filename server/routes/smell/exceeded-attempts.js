import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_EXCEEDED_ATTEMPTS, {
      ...getContext()
    })
  }
}

const getContext = () => {
  return {
    enterAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EXCEEDED_ATTEMPTS,
    handler: handlers.get
  }
]
