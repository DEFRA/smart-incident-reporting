import constants from '../../utils/constants.js'

const createFindAddress = {
  method: 'GET',
  path: constants.routes.FLOOD_FIND_ADDRESS,
  handler: (_request, h) => {
    return h.view('flood/find-address')
  }
}
export default createFindAddress