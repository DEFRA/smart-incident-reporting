const handlers = {
  get: async (request, h) => {
    return h.redirect('https://gov.uk').permanent()
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
