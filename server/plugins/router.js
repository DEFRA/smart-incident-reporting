import constants from '../utils/constants.js'
import testMediaUploadSubmit from '../routes/test-media-upload-submit.js'

const router = async () => {
  const routes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  routes.push(...testMediaUploadSubmit)

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
