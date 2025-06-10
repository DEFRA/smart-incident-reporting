const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    return h.view('500.html')
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
