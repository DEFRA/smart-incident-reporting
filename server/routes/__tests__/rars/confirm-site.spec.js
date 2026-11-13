describe('rars/confirm-site', () => {
  it('Should export createConfirmSiteRoutes function', () => {
    const confirmSiteRoutes = require('../../rars/confirm-site.js')
    expect(typeof confirmSiteRoutes.default).toBe('function')
  })
})
