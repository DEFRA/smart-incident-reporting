describe('Server wrapped', () => {
  it('Initialises', done => {
    jest.isolateModules(() => {
      try {
        const { createServer, init } = require('../index.js')
        jest.mock('../index.js')
        createServer.mockImplementation(() => Promise.resolve())
        init.mockImplementation(() => Promise.resolve())
        // initialise server
        require('../../index.js')
        setImmediate(() => {
          expect(createServer).toHaveBeenCalled()
          expect(init).toHaveBeenCalled()
          done()
        })
      } catch (err) {
        done(err)
      }
    })
  })
  it('Fails initialisation', done => {
    jest.isolateModules(() => {
      try {
        const { createServer, init } = require('../index.js')
        jest.mock('../index.js')
        createServer.mockImplementation(() => Promise.resolve())
        init.mockImplementation(() => Promise.reject(new Error()))
        const processExitSpy = jest
          .spyOn(process, 'exit')
          .mockImplementation(code => {})
        // initialise server
        require('../../index.js')
        setImmediate(() => {
          expect(createServer).toHaveBeenCalled()
          expect(init).toHaveBeenCalled()
          expect(processExitSpy).toHaveBeenCalledWith(1)
          done()
        })
      } catch (err) {
        done(err)
      }
    })
  })
})
