import { createServer, init } from './server/index.js'

createServer()
  .then(server =>
    init(server)
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  )
