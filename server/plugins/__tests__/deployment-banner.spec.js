import serverOptions from '../../__test-helpers__/server-options.js'
import constants from '../../utils/constants.js'

const url = constants.routes.PRIVACY_NOTICE

describe('Deployment Environment Banner', () => {
  const server = { current: null }

  afterEach(async () => {
    if (server.current) {
      await server.current.stop()
      server.current = null
    }
  })

  describe('when DEPLOYMENT_ENV is not set', () => {
    it('should not display the non-live-service-banner class', async () => {
      delete process.env.DEPLOYMENT_ENV
      jest.resetModules()
      const { createServer, init } = await import('../../index.js')

      server.current = await createServer({ ...serverOptions, port: 0 })
      await init(server.current)

      const response = await server.current.inject({ method: 'GET', url })
      expect(response.payload).not.toContain('non-live-service-banner')
    })
  })

  describe('when DEPLOYMENT_ENV is set', () => {
    it.each([
      { deployment: 'development' },
      { deployment: 'test' },
      { deployment: 'training' }
    ])('should display the non-live-service-banner class for $deployment', async ({ deployment }) => {
      process.env.DEPLOYMENT_ENV = deployment
      jest.resetModules()
      const { createServer, init } = await import('../../index.js')

      server.current = await createServer({ ...serverOptions, port: 0 })
      await init(server.current)

      const response = await server.current.inject({ method: 'GET', url })
      expect(response.payload).toContain('non-live-service-banner')
    })

    it.each([
      { deployment: 'development', message: 'This environment is not live - this is the development environment.' },
      { deployment: 'test', message: 'This environment is not live - this is the test environment.' },
      { deployment: 'training', message: 'This environment is not live - this is the training environment.' }
    ])('should display the $deployment environment message', async ({ deployment, message }) => {
      process.env.DEPLOYMENT_ENV = deployment
      jest.resetModules()
      const { createServer, init } = await import('../../index.js')

      server.current = await createServer({ ...serverOptions, port: 0 })
      await init(server.current)

      const response = await server.current.inject({ method: 'GET', url })
      expect(response.payload).toContain(message)
    })

    it.each([
      { deployment: 'pre-production' },
      { deployment: 'production' },
      { deployment: 'unknown' }
    ])('should throw error for invalid deployment environment $deployment', ({ deployment }) => {
      jest.isolateModules(() => {
        process.env.DEPLOYMENT_ENV = deployment
        expect(() => require('../../utils/config.js')).toThrow('The server config is invalid. "deploymentEnv" must be one of [development, test, training]')
      })
    })
  })
})
