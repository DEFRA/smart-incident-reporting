const handlers = {
  get: (_request, h) => {
    return h.redirect('https://www.gov.uk/report-environmental-problem').permanent()
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
