import constants from '../utils/constants.js'

const router = async () => {
  console.log('constants.routes', constants.routes)
  const routes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
