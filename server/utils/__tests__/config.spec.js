describe('utils/config', () => {
  it('Should load successfully with valid environment variables', () => {
    jest.isolateModules(() => {
      expect(() => require('../config.js')).not.toThrow()
    })
  })
  it('Should fail to load if invalid config exists', () => {
    jest.isolateModules(() => {
      process.env.SERVICE_PORT = 'sdfdsfdsf'
      expect(() => require('../config.js')).toThrow('The server config is invalid. "servicePort" must be a number')
    })
  })
})
