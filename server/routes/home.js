import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    return h.view('end-of-private-beta.html')
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
