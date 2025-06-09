import constants from "../utils/constants.js"

const handlers = {
  get: (_request, h) => {
    return h.redirect(constants.urls.GOV_UK_SERVICE_HOME).permanent()
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
