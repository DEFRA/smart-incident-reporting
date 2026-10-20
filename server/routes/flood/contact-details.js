import constants from '../../utils/constants.js'
const createContactDetails = {
  method: 'GET',
  path: constants.routes.FLOOD_CONTACT_DETAILS,
  handler: (_request, h) => {
    return h.view(constants.views.FLOOD_CONTACT_DETAILS)
  }
}

export default createContactDetails
