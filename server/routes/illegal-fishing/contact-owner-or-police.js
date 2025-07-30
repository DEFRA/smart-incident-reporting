import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE,
    handler: handlers.get
  }
]
