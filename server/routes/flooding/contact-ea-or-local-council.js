import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.FLOOD_CONTACT_EA_OR_LOCAL_COUNCIL)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_CONTACT_EA_OR_LOCAL_COUNCIL,
    handler: handlers.get
  }
]
